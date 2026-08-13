import { weightOfThings, type Album } from "@/data/album";
import { WAY_OF_KINGS_PRODUCT } from "@/lib/types/order";

export type CatalogProduct = {
  product: string;
  album: Album;
  downloadHref: string;
};

/** Maps order `product` keys to display + download info. */
const productCatalog: Record<string, CatalogProduct> = {
  [WAY_OF_KINGS_PRODUCT]: {
    product: WAY_OF_KINGS_PRODUCT,
    album: weightOfThings,
    downloadHref: "/api/download/the-way-of-kings",
  },
  // Accept hyphenated variant if an order was stored that way.
  "the-way-of-kings": {
    product: WAY_OF_KINGS_PRODUCT,
    album: weightOfThings,
    downloadHref: "/api/download/the-way-of-kings",
  },
};

function normalizeProductKey(product: string): string {
  return product.trim().toLowerCase().replace(/-/g, "_");
}

export function getCatalogProduct(product: string): CatalogProduct | null {
  if (productCatalog[product]) {
    return productCatalog[product];
  }

  const normalized = normalizeProductKey(product);
  if (productCatalog[normalized]) {
    return productCatalog[normalized];
  }

  return null;
}
