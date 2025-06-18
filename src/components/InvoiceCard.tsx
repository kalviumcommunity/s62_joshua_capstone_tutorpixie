'use client';

import { useSession } from "next-auth/react";

const InvoiceCard = ({ 
  id, 
  amt, 
  currency, 
  username, 
  invoiceDate 
}: {
  id: number;
  amt: number;
  currency: string;
  username?: string;
  invoiceDate?: string;
}) => {
  const { data: session } = useSession();

  if (!session?.user) {
    console.log("No session or user found");
  }

  // Format the amount with currency
  const formatAmount = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
    }).format(amount);
  };

  // Format date if provided
  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewMore = () => {
    // Add logic to view more details about the invoice
    alert(`Viewing invoice ${id}`);
  };

  return (
    <div className="flex justify-between items-center bg-gray-200 rounded-lg p-4 shadow-sm mx-2 mb-2">
      {/* Left section - Username and Invoice ID */}
      <div className="flex flex-col">
        {username && (
          <p className="font-bold text-lg text-black">{username}</p>
        )}
        <p className="text-sm text-gray-600">Invoice #{id}</p>
      </div>
      
      {/* Middle section - Amount and Date */}
      <div className="flex flex-col items-center">
        <p className="font-semibold text-lg text-black">
          {formatAmount(amt, currency)}
        </p>
        <p className="text-sm text-gray-600">
          {formatDate(invoiceDate)}
        </p>
      </div>
      
      {/* Right section - Action button */}
      <button 
        onClick={handleViewMore}
        className="border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        View More
      </button>
    </div>
  );
};

export default InvoiceCard;