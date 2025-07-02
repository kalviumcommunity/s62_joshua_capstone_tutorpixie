'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, FileText, ChevronRight, Clock, User, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingComponent } from "../LoadingComponent";
import ClassesTab from "../ClassesTab";

interface InvoiceDetails {
  id: number;
  amt: string;
  name?: string;
  invoiceDate?: string;
  totalHours?: number;
  subjects?: string[];
  currency?: string;
  status?: string;
}

const InvoiceCard = ({
  id,
  amt,
  name,
  invoiceDate,
  totalHours,
  subjects,
  currency,
  status
}: {
  id: number;
  amt: string;
  name?: string;
  invoiceDate?: string;
  totalHours?: number;
  subjects?: string[];
  currency?: string;
  status?: string;
}) => {
  const { data: session } = useSession();
  const [showSessions, setShowSessions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch billed sessions function using axios
  const fetchBilledSessions = async () => {
    try {
      const res = await axios.get(`/api/invoices/${id}/sessions`);
      if (!res || !res?.data?.success || !res?.data?.data) {
        throw new Error("Error in fetching billed sessions");
      }
      return res.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error in fetching billed sessions");
    }
  };

  // React Query for fetching billed sessions
  const { data: billedSessions, isLoading: loadingSessions, isError, error } = useQuery({
    queryFn: fetchBilledSessions,
    queryKey: ['billed-sessions', id],
    enabled: showSessions, // Only fetch when showSessions is true
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const calcHrs = () =>{
    return billedSessions?.reduce((acc: number, session: any) => {
      return acc + (session.duration || 0);
    }, 0);
  }

  if (!session?.user) {
    console.log("No session or user found");
  }

  const handleViewSessions = () => {
    setShowSessions(true);
  };

  const invoiceDetails: InvoiceDetails = {
    id,
    amt,
    name,
    invoiceDate,
    totalHours,
    subjects,
    currency,
    status
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 mx-2 mb-3 overflow-hidden">
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        <div className="flex justify-between items-center p-4">
          {/* Left section - Username and Invoice ID */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col">
              {name && (
                <h3 className="font-semibold text-base text-gray-900 leading-tight">
                  {name}
                </h3>
              )}
              <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 inline-block w-fit">
                #{id.toString().substring(0, 8)}
              </span>
            </div>
          </div>

          {/* Middle section - Amount and Date */}
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-lg text-gray-900">
                {amt}
              </span>
            </div>
            {invoiceDate && (
              <div className="flex items-center space-x-1 text-gray-500">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">
                  {invoiceDate}
                </span>
              </div>
            )}
          </div>

          {/* Right section - Action button */}
          <div className="flex-shrink-0 ml-4">
            <DialogTrigger asChild>
              <button className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 flex items-center space-x-1">
                <span>View</span>
                <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </DialogTrigger>
          </div>
        </div>
      </div>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          {!showSessions ? (
            <>
              {/* Invoice Details Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Invoice #{invoiceDetails.id.toString().substring(0, 8)}
                    </h3>
                    {invoiceDetails.status && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                        {invoiceDetails.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {invoiceDetails.name && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Student</p>
                        <p className="font-medium text-gray-900">{invoiceDetails.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="font-bold text-lg text-gray-900">{invoiceDetails.amt}</p>
                    </div>
                  </div>

                  {invoiceDetails.invoiceDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Invoice Date</p>
                        <p className="font-medium text-gray-900">{invoiceDetails.invoiceDate}</p>
                      </div>
                    </div>
                  )}

                  {billedSessions && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Total Hours</p>
                        <p className="font-medium text-gray-900">{calcHrs()}h</p>
                      </div>
                    </div>
                  )}
                </div>

                {invoiceDetails.subjects && invoiceDetails.subjects.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {invoiceDetails.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View Billed Sessions Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleViewSessions}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-100 active:scale-90 flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>View Billed Sessions</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <div className="mb-4">
                <button
                  onClick={() => setShowSessions(false)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ChevronRight className="w-4 h-4 transform rotate-180" />
                  <span>Back to Invoice Details</span>
                </button>
              </div>

              {/* Billed Sessions Content */}
              <div className="w-full h-[3/4] overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto">
                  {loadingSessions ? (
                    <LoadingComponent title="Billed Sessions" />
                  ) : isError ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Billed Sessions</h3>
                      <div className="text-center py-8 text-red-500">
                        <p>Error loading sessions. Please try again.</p>
                      </div>
                    </div>
                  ) : (
                    <ClassesTab name="Billed Sessions" type="billed" apiData={billedSessions || []} />
                    
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceCard;