"use client";

import { useQuery } from '@tanstack/react-query';
import PayNow from './PayNow';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export interface BillingData {
  totalAmount: number;
  totalHours: number;
  subjects: string[];
  invoiceId?: string;
  currency?: string;
  tutorPayout?: number;
}

interface BillingResponse {
  success: boolean;
  data: BillingData;
  message?: string;
}

// API function for fetching billing data
const fetchBillingData = async (): Promise<BillingData> => {
  const result = await axios.get<BillingResponse>('/api/invoices/current');
  
  if (!result || !result.data || !result.data.success) {
    throw new Error(result?.data?.message || 'Failed to fetch billing data');
  }

  if (!result.data.data) {
    throw new Error('Invalid response format - no data received');
  }

  return result.data.data;
};

export default function CurrentInvoice() {
  const { data: session } = useSession();

  // React Query hook for fetching billing data
  const {
    data: billingData,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['currentInvoice'],
    queryFn: fetchBillingData,
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    onError: (err) => {
      console.error('Error fetching billing data:', err);
    }
  });

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

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Billing Summary</h1>
        </div>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-2">
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

  // Error state
  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load billing data';
    
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
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - billingData is guaranteed to exist here
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
        <div className="flex flex-wrap gap-4">
          {/* Total Amount */}
          <div className="bg-blue-50 flex-1 rounded-lg p-4 border border-blue-100">
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
          <div className="bg-green-50 flex-1 rounded-lg p-4 border border-green-100">
            <div className="text-sm font-medium text-green-600 mb-1">Total Hours</div>
            <div className="text-xl font-bold text-green-900">
              {billingData.totalHours}
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-purple-50 flex-1 rounded-lg p-4 border border-purple-100">
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
          {billingData.tutorPayout !== undefined && (
            <div className="bg-amber-50 flex-1 rounded-lg p-4 border border-amber-100">
              <div className="text-sm font-medium text-amber-600 mb-1">Tutor Payout</div>
              <div className="text-xl font-bold text-amber-700">
                {getCurrencySymbol(billingData.currency)}{billingData.tutorPayout.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pay Now Button */}
        {session?.user?.role === 'Student' && (
          <div className="flex justify-start items-center">
            <PayNow
              invoiceId={billingData.invoiceId || undefined}
              amount={billingData.totalAmount}
              currency={billingData.currency || 'INR'}
            />
          </div>
        )}
      </div>
    </div>
  );
}