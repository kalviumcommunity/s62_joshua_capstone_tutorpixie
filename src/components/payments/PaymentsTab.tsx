"use client";
import React, { useMemo } from "react";
import PaymentCard from "@/components/payments/PaymentCard";
import { getCurrencySymbol } from "@/components/billing/CurrentInvoice";
import { AddPaymentButton } from "./AddPayment";
import { useSession } from "next-auth/react";

interface Payment {
  id: string;
  amt: number;
  currency: string;
  paymentDate: string;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  invoicesId?: string;
  userId?: number;
  user?: {
    name: string;
  };
  invoice?: {
    id: string;
    // Add other invoice fields if needed
  };
}

const PaymentsTab: React.FC<{ 
  name: string; 
  apiData?: Payment[];
}> = ({
  name,
  apiData = []
}) => {

  const {data: session} = useSession();

  const payments = useMemo(() => {
    if (!apiData || apiData.length === 0) {
      return [];
    }

    return apiData.map((payment) => ({
      ...payment,
      paymentDate: new Date(payment.paymentDate),
      userName: payment.user?.name,
      invoiceId: payment.invoicesId,
    }));
  }, [apiData]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <div className="text-4xl mb-4">💳</div>
      <p>No {name.toLowerCase()} found</p>
      <p className="text-sm text-gray-500 mt-1">Payments will appear here when available</p>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg flex flex-col h-full w-full">
      <div className="flex flex-row justify-between mx-2">
        <h2 className="text-xl font-bold mb-4 shrink-0">{name}</h2>
        {
          session?.user?.role =="Admin" && 
          <AddPaymentButton/>
        }
      </div>
      <div className="space-y-4 overflow-auto flex-1">
        {payments.length === 0 ? (
          renderEmptyState()
        ) : (
          payments.map((payment, index) => (
            <PaymentCard
              key={payment.id || index}
              id={payment.id}
              amt={payment.amt}
              currency={payment.currency}
              paymentDate={payment.paymentDate}
              paymentMethod={payment.paymentMethod?.toWellFormed() || 'unknown'}
              razorpayPaymentId={payment.razorpayPaymentId}
              razorpayOrderId={payment.razorpayOrderId}
              status={payment.status}
              invoiceId={payment.invoiceId}
              userId={payment.userId}
              userName={payment.userName}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;