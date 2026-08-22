"use server";

import { getDownloadUrl, issueSignedToken, presignUrl } from "@vercel/blob";
import { Resend } from "resend";
import {
  isAllowedJamFile,
  isJamBlobUrl,
  JAM_FILE_ERROR,
  JAM_MAX_FILE_BYTES,
  JAM_MAX_FILE_MB,
  JAM_SONGS,
  type JamSong,
} from "@/data/jam";
import { buildJamNotificationEmail } from "@/lib/jam-email";

export type JamSubmissionResult = {
  ok: boolean;
  error?: string;
};

const NOTIFY_EMAIL = "merlinnmusic@gmail.com";
const FROM_EMAIL = "Merlinn <onboarding@resend.dev>";
const SIGNED_URL_MS = 7 * 24 * 60 * 60 * 1000;

function asTrimmedString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function blobPathnameFromUrl(blobUrl: string): string {
  return decodeURIComponent(new URL(blobUrl).pathname.replace(/^\/+/, ""));
}

async function createSignedJamUrls(fileUrl: string): Promise<{
  fileUrl: string;
  downloadUrl: string;
}> {
  const pathname = blobPathnameFromUrl(fileUrl);
  const validUntil = Date.now() + SIGNED_URL_MS;
  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
    validUntil,
  });

  return {
    fileUrl: presignedUrl,
    downloadUrl: getDownloadUrl(presignedUrl),
  };
}

function isJamSong(value: string): value is JamSong {
  return (JAM_SONGS as readonly string[]).includes(value);
}

export async function submitJam(
  _prev: JamSubmissionResult,
  formData: FormData,
): Promise<JamSubmissionResult> {
  const song = asTrimmedString(formData.get("song"));
  const name = asTrimmedString(formData.get("name"));
  const email = asTrimmedString(formData.get("email"));
  const socials = asTrimmedString(formData.get("socials"));
  const message = asTrimmedString(formData.get("message"));
  const consent = formData.get("consent");
  const fileName = asTrimmedString(formData.get("fileName"));
  const fileSize = Number(asTrimmedString(formData.get("fileSize")));
  const fileUrl = asTrimmedString(formData.get("fileUrl"));
  const downloadUrl = asTrimmedString(formData.get("downloadUrl")) || fileUrl;

  if (!isJamSong(song)) {
    return { ok: false, error: "Please choose a Merlinn song." };
  }

  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "Please enter a name or stage name." };
  }

  if (!email.includes("@") || email.length > 120) {
    return { ok: false, error: "Please enter a valid email." };
  }

  if (socials.length > 200) {
    return { ok: false, error: "Social handles are a bit long — shorten them if you can." };
  }

  if (message.length > 500) {
    return { ok: false, error: "Keep the note under 500 characters." };
  }

  if (consent !== "on") {
    return {
      ok: false,
      error: "Please agree to the license so I can actually use the video.",
    };
  }

  if (!fileName || !isAllowedJamFile({ name: fileName })) {
    return {
      ok: false,
      error: JAM_FILE_ERROR,
    };
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return { ok: false, error: "Please attach a video." };
  }

  if (fileSize > JAM_MAX_FILE_BYTES) {
    return {
      ok: false,
      error: `That file is over ${JAM_MAX_FILE_MB}MB. Try a smaller file.`,
    };
  }

  if (!isJamBlobUrl(fileUrl) || !isJamBlobUrl(downloadUrl)) {
    return {
      ok: false,
      error: "The video didn't upload correctly. Please try again.",
    };
  }

  const submission = {
    song,
    name,
    email,
    socials: socials || null,
    message: message || null,
    fileName,
    fileSize,
    fileUrl,
    downloadUrl,
  };

  console.info("[lets-jam] submission received", submission);

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const signedUrls = await createSignedJamUrls(fileUrl);
    const emailContent = buildJamNotificationEmail({
      song,
      name,
      email,
      socials,
      message,
      fileName,
      fileSize,
      fileUrl: signedUrls.fileUrl,
      downloadUrl: signedUrls.downloadUrl,
      receivedAt: new Date(),
    });

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[lets-jam] notification email failed", {
      error,
      submission,
    });
  }

  return { ok: true };
}
