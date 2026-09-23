export const PRICE_USDC_MICROS = 180_000;
export const CAP_USDC_MICROS = 250_000;
export const formatUsdc = (micros: number) => `$${(micros / 1_000_000).toFixed(2)}`;
export const withinCap = (micros: number) => micros <= CAP_USDC_MICROS;
