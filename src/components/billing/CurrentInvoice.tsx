"use client";

import { useState, useEffect } from 'react';

export interface BillingData {
  totalAmount: number;
  totalHours: number;
  subjects: string[];
  lastInvoiceDate?: string;
  currency?: string;
  tutorPayout?: number;
}

export default function CurrentInvoice() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingData, setBillingData] = useState<BillingData>({
    totalAmount: 0,
    totalHours: 0.0,
    subjects: [],
    currency: 'USD'
  });

  // Fetch billing data on component mount
  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/invoices/current');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch billing data');
      }

      if (result.success && result.data) {
        setBillingData(result.data);
      } else {
        throw new Error(result.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching billing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load billing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async () => {
    alert("Pay now")
    // if (billingData.totalAmount <= 0) {
    //   alert('No amount to pay');
    //   return;
    // }

    // setIsProcessing(true);
    // try {
    //   // TODO: Replace with actual payment processing API call
    //   const response = await fetch('/api/payments/process', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       amount: billingData.totalAmount,
    //       currency: billingData.currency || 'USD'
    //     }),
    //   });

    //   const result = await response.json();

    //   if (result.success) {
    //     alert('Payment processed successfully!');
    //     // Refresh billing data after successful payment
    //     await fetchBillingData();
    //   } else {
    //     throw new Error(result.message || 'Payment failed');
    //   }
    // } catch (error) {
    //   console.error('Payment error:', error);
    //   alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  const getCurrencySymbol = (currency: string = 'USD'): string => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'INR': '₹',
      'AUD': 'A$'
    };
    return symbols[currency] || '$';
  };

  const convertAmountToWords = (amount: number): string => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const thousands = ['', 'thousand', 'million', 'billion'];

    if (amount === 0) return 'zero';

    const convertHundreds = (num: number): string => {
      let result = '';
      
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' hundred ';
        num %= 100;
      }
      
      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10) {
        result += teens[num - 10] + ' ';
        num = 0;
      }
      
      if (num > 0) {
        result += ones[num] + ' ';
      }
      
      return result.trim();
    };

    const parts = [];
    let dollarsAmount = Math.floor(amount);
    let centsAmount = Math.round((amount - dollarsAmount) * 100);
    
    if (dollarsAmount === 0) {
      parts.push('zero');
    } else {
      let groupIndex = 0;
      while (dollarsAmount > 0) {
        const group = dollarsAmount % 1000;
        if (group !== 0) {
          const groupWords = convertHundreds(group);
          parts.unshift(groupWords + (thousands[groupIndex] ? ' ' + thousands[groupIndex] : ''));
        }
        dollarsAmount = Math.floor(dollarsAmount / 1000);
        groupIndex++;
      }
    }
    
    if (centsAmount > 0) {
      parts.push('and ' + convertHundreds(centsAmount));
    }
    
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getCurrentDateTime = (): string => {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Billing Summary</h1>
        </div>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-x-2">
            <div className="flex justify-center items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            </div>
            <span className="text-gray-600">Loading billing data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Billing Summary</h1>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Billing Data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchBillingData}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Billing Summary</h1>
        <p className="text-sm text-gray-600 mt-1">Invoice Date: {getCurrentDateTime()}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Amount */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm font-medium text-blue-600 mb-1">Total Amount</div>
            <div className="text-xl font-bold text-blue-900 mb-1">
              {getCurrencySymbol(billingData.currency)}{billingData.totalAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
            <div className="text-xs text-blue-700 capitalize">
              {convertAmountToWords(billingData.totalAmount)}
            </div>
          </div>

          {/* Total Hours */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-sm font-medium text-green-600 mb-1">Total Hours</div>
            <div className="text-xl font-bold text-green-900">
              {billingData.totalHours}
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-600 mb-1">Subjects</div>
            <div className="text-xl font-bold text-purple-900">
              {billingData.subjects.length}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {billingData.subjects.length > 0 ? (
                billingData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {subject}
                  </span>
                ))
              ) : (
                <span className="text-xs text-purple-600">No subjects</span>
              )}
            </div>
          </div>

          {/* Tutor Payout */}
          { (billingData?.tutorPayout)&&
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="text-sm font-medium text-amber-600 mb-1">Tutor Payout</div>
              <div className="text-xl font-bold text-amber-700">
                {getCurrencySymbol(billingData.currency)}{billingData.tutorPayout.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              </div>
            </div>
          }
        </div>

        {/* Pay Now Button */}
        <div className="flex justify-start items-center">
          {/* <div className='text-gray-600'>
            Last Invoice Date: {formatDate(billingData.lastInvoiceDate)}
          </div> */}
          <button
            onClick={handlePayNow}
            disabled={isProcessing || billingData.totalAmount <= 0}
            className={`
              px-8 py-2 rounded-lg font-medium text-white transition-all duration-200
              ${isProcessing || billingData.totalAmount <= 0
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : billingData.totalAmount <= 0 ? (
              'No Amount Due'
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}