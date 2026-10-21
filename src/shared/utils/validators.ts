export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidSku(sku: string): boolean {
  if (!sku || typeof sku !== 'string') return false;
  return sku.trim().length >= 3;
}

export function isNonNegativeNumber(val: unknown): boolean {
  return typeof val === 'number' && !isNaN(val) && val >= 0;
}
