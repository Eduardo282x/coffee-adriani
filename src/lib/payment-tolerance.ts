const rawTolerance = Number(import.meta.env.VITE_PAYMENT_TOLERANCE_USD);
const parsedTolerance = Number.isFinite(rawTolerance) && rawTolerance >= 0 ? rawTolerance : 2;

export const PAYMENT_TOLERANCE_USD = parsedTolerance;

export const toUsd = (value: number | string | null | undefined): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const isWithinPaymentTolerance = (remaining: number | string | null | undefined): boolean => {
    return Math.abs(toUsd(remaining)) <= PAYMENT_TOLERANCE_USD;
};

// Límites del DTO de asociación de pagos: @IsNumber({ maxDecimalPlaces: 2 }) con @Min(0.01) y @Max(9999999.99)
export const MIN_PAYMENT_AMOUNT_USD = 0.01;
export const MAX_PAYMENT_AMOUNT_USD = 9999999.99;

export const isValidPaymentAmount = (amount: number | string | null | undefined): boolean => {
    const parsed = Number(amount);

    if (!Number.isFinite(parsed)) {
        return false;
    }

    if (parsed < MIN_PAYMENT_AMOUNT_USD || parsed > MAX_PAYMENT_AMOUNT_USD) {
        return false;
    }

    // maxDecimalPlaces: 2 en el backend
    return /^\d+(\.\d{1,2})?$/.test(String(parsed));
};
