export const supportedCurrencies = [
    "INR",
    "USD",
    "AUD"
]

export const currencyConfigs = {
  'INR': {
    symbol: '₹',
    locale: 'en-IN',
    multiplier: 100, // Razorpay expects amount in paise for INR
    name: 'Indian Rupee'
  },
  'USD': {
    symbol: '$',
    locale: 'en-US',
    multiplier: 100, // Razorpay expects amount in cents for USD
    name: 'US Dollar'
  },
  'AUD': {
    symbol: 'AUD $',
    locale: 'en-AU',
    multiplier: 100, // Razorpay expects amount in cents for AUD
    name: 'Australian Dollar'
  }
};

// Define conversion rates
const conversionRates: { [key: string]: number } = {
    "INR": 1,
    "USD": 85.87, 
    "AUD": 55.0  
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