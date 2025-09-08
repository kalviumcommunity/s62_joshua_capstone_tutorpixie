"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PaymentsTab from "@/components/payments/PaymentsTab";

// Fetch function for payments
const fetchPayments = async () => {
  const response = await axios.get('/api/payments');
  console.log("Payments data:", response.data.data);
  return response.data.data;
};

const PaymentsDashboard: React.FC = () => {
  // Fetch payments
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError
  } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
  });

  if (paymentsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading payments...</div>
      </div>
    );
  }

  if (paymentsError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error loading payments</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PaymentsTab
        name="Payments"
        apiData={paymentsData}
      />
    </div>
  );
};

export default PaymentsDashboard;