export function extractPVN(
  valueWithPVN?: number,
  pvnRate: number = 1.21
): { withPVN: string; withoutPVN: string; pvnAmount: string } {
  if (!valueWithPVN) {
    return {
      withPVN: '0.00',
      withoutPVN: '0.00',
      pvnAmount: '0.00',
    };
  }

  const withoutPVN = valueWithPVN / pvnRate;
  const pvnAmount = valueWithPVN - withoutPVN;

  const formattedValue = (value: number) => value.toFixed(2);

  return {
    withPVN: formattedValue(valueWithPVN),
    withoutPVN: formattedValue(withoutPVN),
    pvnAmount: formattedValue(pvnAmount),
  };
}
