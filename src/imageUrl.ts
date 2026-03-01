declare const __IMAGE_HASHES__: Record<string, string>;

const hashes: Record<string, string> =
  typeof __IMAGE_HASHES__ !== 'undefined' ? __IMAGE_HASHES__ : {};

export function imageUrl(file: string): string {
  const hash = hashes[file];
  return hash ? `images/${file}?v=${hash}` : `images/${file}`;
}
