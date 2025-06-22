"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import axios from "axios";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PayNowProps {
  amount?: number;
  currency?: string;
  invoiceId?: string;
}

const PayNow: React.FC<PayNowProps> = ({ 
  amount = 0, 
  currency = "INR",
  invoiceId
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user) {
      setError("User not found. Please log in to continue.");
    } else {
      setError("");
    }
  }, [user]);

  // Check if Razorpay script is already loaded on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setScriptLoaded(true);
    }
  }, []);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  const handleScriptError = () => {
    setError("Failed to load payment system");
    setScriptLoaded(false);
  };

  const handlePayment = async () => {
    if (!user) {
      setError("User not found. Please log in to continue.");
      return;
    }

    if (amount <= 0) {
      setError("Invalid amount for payment.");
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      setError("Payment system is loading. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const res = await axios.post('/api/payments/create-order', {
        amount: amount,
        currency: currency
      });

      if (!res.data.orderId || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, 
        currency: currency,
        name: "TutorPixie",
        description: "Invoice Payment",
        order_id: res.data.orderId,
        handler: async (response: any) => {
          try {
            console.log("Payment Successful", response);
            
            // Verify payment on backend
            const verifyRes = await axios.post('/api/invoices/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId
            });

            if (!verifyRes?.data?.success){
              throw new Error('Payment verification failed');
            }
            alert('Payment completed successfully!');
            window.location.reload();
            
            setIsProcessing(false); // Reset processing state
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            alert('Payment successful but verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: "#3B82F6", // Changed to proper blue color
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false); // Reset processing state
            console.log("Payment modal dismissed");
          },
          escape: true,
          backdropclose: false,
        }
      };

      const rzpy = new window.Razorpay(options);
      
      rzpy.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      rzpy.open();
    } catch (error) {
      console.error("Error in payment:", error);
      setError(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Payment initialization failed. Please try again."
      );
      setIsProcessing(false);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = isProcessing || amount <= 0 || !user || (!scriptLoaded || !window.Razorpay);

  return (
    <div className="space-y-2 flex flex-row">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="afterInteractive"
      />
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isButtonDisabled}
        className={`
          px-8 py-2 rounded-lg font-medium text-white transition-all duration-200
          ${isButtonDisabled
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
        ) : !user ? (
          'Please Login'
        ) : amount <= 0 ? (
          'No Amount Due'
        ) : (!scriptLoaded || !window.Razorpay) ? (
          'Loading...'
        ) : (
          `Pay ₹${amount.toLocaleString('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}`
        )}
      </button>
    </div>
  );
};

export default PayNow;