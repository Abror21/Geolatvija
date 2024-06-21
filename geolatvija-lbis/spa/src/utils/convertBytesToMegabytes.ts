export function convertBytesToMegabytes(bytes: number): string {
  const fileSizeInMB = bytes / 1024 / 1024;
  return Math.max(fileSizeInMB, 0.1).toFixed(1);
}
