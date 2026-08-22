import {
  BlobAccessError,
  getDownloadUrl,
  put,
  type PutBlobResult,
} from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  isAllowedJamFile,
  jamBlobPathname,
  JAM_FILE_ERROR,
  JAM_MAX_FILE_BYTES,
  JAM_MAX_FILE_MB,
} from "@/data/jam";

export const maxDuration = 60;

function isRecordingFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && Boolean(value.name);
}

function isAccessRejected(error: unknown): boolean {
  if (error instanceof BlobAccessError) return true;
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return (
    message.includes("access") ||
    message.includes("private") ||
    message.includes("public")
  );
}

async function putRecording(file: File): Promise<PutBlobResult> {
  const pathname = jamBlobPathname(file.name);
  const options = {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: true,
    multipart: true,
    contentType: file.type || undefined,
    maximumSizeInBytes: JAM_MAX_FILE_BYTES,
  };

  try {
    return await put(pathname, file, { ...options, access: "public" });
  } catch (error) {
    if (!isAccessRejected(error)) {
      throw error;
    }

    return put(pathname, file, { ...options, access: "private" });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "File storage is not configured yet." },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Couldn't read that file. Please try again." },
      { status: 400 },
    );
  }

  const file = formData.get("recording");

  if (!isRecordingFile(file) || !isAllowedJamFile(file)) {
    return NextResponse.json(
      {
        error: JAM_FILE_ERROR,
      },
      { status: 400 },
    );
  }

  if (file.size > JAM_MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: `That file is over ${JAM_MAX_FILE_MB}MB. Try a smaller file.` },
      { status: 400 },
    );
  }

  try {
    const blob = await putRecording(file);
    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl || getDownloadUrl(blob.url),
    });
  } catch (error) {
    console.error("[lets-jam] blob upload failed", error);
    return NextResponse.json(
      { error: "Couldn't upload that file. Please try again." },
      { status: 500 },
    );
  }
}
