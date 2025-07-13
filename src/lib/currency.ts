export const supportedCurrencies = [
    "INR",
    "USD",
    "AUD"
]

// Define conversion rates
const conversionRates: { [key: string]: number } = {
    "INR": 1,
    "USD": 85.87, // Example rate, adjust as needed
    "AUD": 55.0  // Example rate, adjust as needed
};

// write a function to convert a given amount from one currency to another
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
        return amount;
    }

    if (!conversionRates[fromCurrency] || !conversionRates[toCurrency]) {
        throw new Error("Unsupported currency");
    }

    // Convert amount to base currency (INR)
    const amountInBase = amount / conversionRates[fromCurrency];

    // Convert from base currency to target currency
    return amountInBase * conversionRates[toCurrency];
}

export function convertToINR(amount: number, currency: string): number {
    if (!conversionRates[currency]) {
        throw new Error("Unsupported currency");
    }
    return amount / conversionRates[currency];
}

export function convertFromINR(amount: number, currency: string): number {
    if (!conversionRates[currency]) {
        throw new Error("Unsupported currency");
    }
    return amount * conversionRates[currency];
}