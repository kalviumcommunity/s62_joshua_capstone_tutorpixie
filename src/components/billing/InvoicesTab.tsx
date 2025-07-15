"use client";
import React, { useMemo } from "react";
import InvoiceCard from "./InvoiceCard";
import { getCurrencySymbol } from "./CurrentInvoice";

interface Invoice {
  id: number;
  amt: number;
  currency: string;
  user?: {
    name: string;
  };
  invoiceDate?: string;
}

const InvoicesTab: React.FC<{name: string, apiData?: Invoice[]}> = ({name, apiData = []}) => {

    // Format date if provided
    const formatDate = (date?: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
    };

    const formatAmount = (amount: number, curr: string) => {
      return `${getCurrencySymbol(curr)}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    };

  // Use useMemo to transform data only when apiData changes
    const invoices = useMemo(() => {
        if (!apiData || apiData.length === 0) {
        return [];
        }

        return apiData.map(invoiceItem => {
            // Format the invoice date
            const formattedDate = formatDate(invoiceItem.invoiceDate);
            // Format the amount with currency
            const formattedAmount = formatAmount(invoiceItem.amt, invoiceItem.currency);
        
        return {
            id: invoiceItem.id,
            amt: formattedAmount,
            name: invoiceItem?.user?.name || undefined,
            invoiceDate: formattedDate
        };
        });
    }, [apiData]);

  return (
  <div className="bg-gray-900 text-white p-6 rounded-lg flex flex-col h-full w-full">
    <h2 className="text-xl font-bold mb-4 shrink-0">{name}</h2>
    <div className="space-y-4 overflow-auto flex-1">
      {invoices.map((item, index) => (
        <InvoiceCard
          key={index}
          id={item.id}
          amt={item.amt}
          name={item.name}
          invoiceDate={item.invoiceDate}
        />
      ))}
    </div>
  </div>
);

};

export default InvoicesTab;