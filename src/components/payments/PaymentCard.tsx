'use client';

import { CreditCard, Calendar, User, ExternalLink, CheckCircle, XCircle, Clock, Edit, Trash2, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
type Currency = 'INR' | 'USD' | 'EUR';

type PaymentCardProps = {
  id: string;
  amt: number;
  currency: Currency;
  paymentDate: Date;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  status?: PaymentStatus;
  invoiceId?: string;
  userId?: number;
  userName?: string;
  invoiceDescription?: string;
  onEdit?: (id: string) => void;
};

const PaymentCard = ({
  id,
  amt,
  currency,
  paymentDate,
  paymentMethod,
  razorpayPaymentId,
  status = 'pending',
  invoiceId,
  userId,
  userName,
  onEdit
}: PaymentCardProps) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Format amount with currency
  const formatAmount = (amount: number, curr: Currency) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Get status color and icon
  const getStatusDisplay = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-green-700 bg-green-50 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Completed'
        };
      case 'failed':
        return {
          color: 'text-red-700 bg-red-50 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          text: 'Failed'
        };
      case 'refunded':
        return {
          color: 'text-orange-700 bg-orange-50 border-orange-200',
          icon: <RefreshCw className="w-4 h-4" />,
          text: 'Refunded'
        };
      case 'pending':
      default:
        return {
          color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending'
        };
    }
  };

  const statusDisplay = getStatusDisplay(status);

  // Delete payment mutation
  // const deletePaymentMutation = useMutation({
  //   mutationFn: () => axios.delete(`/api/payments/${id}`),
  //   onMutate: () => {
  //     toast.loading('Deleting payment...', {
  //       id: `delete-${id}`
  //     });
  //   },
  //   onSuccess: () => {
  //     toast.dismiss(`delete-${id}`);
  //     toast.success("Payment deleted successfully", {
  //       style: { color: "green" }
  //     });
  //     queryClient.invalidateQueries({ queryKey: ["payments"] });
  //   },
  //   onError: (error) => {
  //     console.log("Error deleting payment", error);
  //     toast.dismiss(`delete-${id}`);
  //     toast.error("Failed to delete payment", {
  //       style: { color: "red" },
  //       duration: 5000,
  //       action: {
  //         label: "Try Again",
  //         onClick: () => deletePaymentMutation.mutate(),
  //       },
  //     });
  //   }
  // });

  return (
    <div className="bg-white rounded-xl py-2 px-4 shadow-sm border border-gray-100 mx-2 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Payment Amount and Method */}
        <div className="flex-shrink-0">
          <h3 className="font-semibold text-lg text-gray-900">
            {formatAmount(amt, currency)}
          </h3>

          <div className="flex flex-row items-center justify-start w-37 gap-2">
            {/* Status Badge */}
            <div className={`flex items-center gap-1 px-3 py-2 rounded-full border text-xs font-medium ${statusDisplay.color}`}>
              {statusDisplay.icon}
              <span>{statusDisplay.text}</span>
            </div>
            

            {/* Action Buttons */}
            {/* <div className="flex gap-2">
              {(session?.user?.role === 'Admin' || session?.user?.id === userId) && (
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                  onClick={handleEdit}
                  title="Edit Payment"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              {(session?.user?.role === 'Admin' || session?.user?.id === userId) && (
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                  onClick={handleDelete}
                  disabled={deletePaymentMutation.isLoading}
                  title="Delete Payment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div> */}
            {razorpayPaymentId && (
              <div className="flex-shrink-0 mx-2">
                      <a href={`https://dashboard.razorpay.com/app/payments/${razorpayPaymentId}`} target="_blank" rel="noopener noreferrer">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </a>
              </div>
            )}
          </div>

        </div>

        {/* Center: Payment Details */}
        <div className="text-center flex-1 min-w-0">
          {/* Invoice Id */}
          {invoiceId && (
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
              <span className="truncate font-medium text-gray-800">
                {`Invoice #${invoiceId.substring(0, 8)}`}
              </span>
            </div>
          )}

          {/* Date and Time */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-normal text-gray-500">{formatDate(paymentDate)}</p>
            </div>
            {/* <div className="flex items-center justify-center gap-1 mb-1">
              <p className="text-sm font-normal text-gray-500">{formatTime(paymentDate)}</p>
            </div> */}
          </div>
        </div>

        {/* Right: Status and Actions */}
        <div className="flex-shrink-0 flex flex-col">
          
          {paymentMethod && (
            <div className="flex text-right items-center justify-end gap-1 mt-1">
              <p className="text-sm text-gray-500 capitalize">{paymentMethod}</p>
              <CreditCard className="w-4 h-4 text-gray-500" />
            </div>
          )}
          {/* User info */}
          {userName && (
            <div className="flex text-right items-center justify-end gap-1 mt-1">
              <span className="text-sm text-gray-500 capitalize">{userName}</span>
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;