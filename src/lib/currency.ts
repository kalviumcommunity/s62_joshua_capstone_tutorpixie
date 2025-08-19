export const supportedCurrencies = [
    "INR",
    "USD",
    "AUD"
] as const;

export type Currency = typeof supportedCurrencies[number];

export const currencyConfigs: Record<Currency, {
  symbol: string;
  locale: string;
  multiplier: number;
  name: string;
}> = {
  'INR': {
    symbol: '₹',
    locale: 'en-IN',
    multiplier: 100,
    name: 'Indian Rupee'
  },
  'USD': {
    symbol: '$',
    locale: 'en-US',
    multiplier: 100,
    name: 'US Dollar'
  },
  'AUD': {
    symbol: 'AUD $',
    locale: 'en-AU',
    multiplier: 100,
    name: 'Australian Dollar'
  }
};

const conversionRates: Record<Currency, number> = {
    "INR": 1,
    "USD": 85.87,
    "AUD": 55.0
};

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
    if (fromCurrency === toCurrency) {
        return amount;
    }

    if (!conversionRates[fromCurrency] || !conversionRates[toCurrency]) {
        throw new Error("Unsupported currency");
    }

    const amountInBase = amount / conversionRates[fromCurrency];
    return amountInBase * conversionRates[toCurrency];
}

export function convertToINR(amount: number, currency: Currency): number {
    if (!conversionRates[currency]) {
        throw new Error("Unsupported currency");
    }
    return amount * conversionRates[currency];
}

export function convertFromINR(amount: number, currency: Currency): number {
    if (!conversionRates[currency]) {
        throw new Error("Unsupported currency");
    }
    return amount / conversionRates[currency];
}