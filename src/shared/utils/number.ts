export function formatDecimal(num: number, decimals: number): string {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: false,
  }).format(num);

  return formattedNumber;
}
