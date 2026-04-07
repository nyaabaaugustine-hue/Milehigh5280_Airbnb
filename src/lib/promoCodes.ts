export interface PromoCode {
  discount: number;
  type: 'percent' | 'fixed';
  label: string;
  description: string;
}

export const PROMO_CODES: Record<string, PromoCode> = {
  WELCOME10:  { discount: 10, type: 'percent', label: '10% Welcome Discount', description: 'For first-time guests' },
  GHANA20:    { discount: 20, type: 'percent', label: '20% Ghana Pride',       description: 'Exclusive Ghana resident discount' },
  MILEHIGH15: { discount: 15, type: 'percent', label: '15% Loyalty Reward',    description: 'For returning guests' },
  SUMMER25:   { discount: 25, type: 'percent', label: '25% Summer Special',    description: 'Seasonal offer' },
};

export function validatePromoCode(code: string): PromoCode | null {
  return PROMO_CODES[code.trim().toUpperCase()] ?? null;
}

export function applyPromoCode(
  total: number,
  code: PromoCode,
): { discountedTotal: number; savings: number } {
  if (code.type === 'fixed') {
    return { discountedTotal: Math.max(0, total - code.discount), savings: code.discount };
  }
  const savings = (total * code.discount) / 100;
  return { discountedTotal: total - savings, savings };
}
