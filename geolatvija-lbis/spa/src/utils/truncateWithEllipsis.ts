export default function truncateWithEllipsis(value: string, maxLength: number): string {
  if (value?.length > maxLength) {
    return `${value.slice(0, maxLength)}...`;
  }

  return value;
}
