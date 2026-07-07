export function currencySymbol(currency = 'USD'): string {
  const map: Record<string, string> = {
    USD: '$', INR: '₹', GBP: '£', EUR: '€',
    JPY: '¥', CNY: '¥', HKD: 'HK$', KRW: '₩',
    AUD: 'A$', CAD: 'C$', CHF: 'Fr', SGD: 'S$',
  };
  return map[currency] ?? currency + ' ';
}

export function formatPrice(price: number, currency = 'USD'): string {
  const sym = currencySymbol(currency);
  if (price >= 10000) return `${sym}${price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  if (price >= 1000) return `${sym}${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  return `${sym}${price.toFixed(2)}`;
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return volume.toFixed(0);
}

export function formatMarketCap(cap: number, currency = 'USD'): string {
  const sym = currencySymbol(currency);
  if (cap >= 1e12) return `${sym}${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `${sym}${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `${sym}${(cap / 1e6).toFixed(2)}M`;
  return `${sym}${cap.toFixed(0)}`;
}
