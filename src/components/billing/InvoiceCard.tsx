'use client';

import { useSession } from "next-auth/react";
import { Calendar, FileText, ChevronRight } from "lucide-react";

const InvoiceCard = ({
  id,
  amt,
  name,
  invoiceDate
}: {
  id: number;
  amt: string;
  name?: string;
  invoiceDate?: string;
}) => {
  const { data: session } = useSession();

  if (!session?.user) {
    console.log("No session or user found");
  }

  const handleViewMore = () => {
    // Add logic to view more details about the invoice
    alert(`Viewing invoice ${id}`);
  };

  return (
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
              Invoice #{id.toString().substring(0, 8)}
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
          <button
            onClick={handleViewMore}
            className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 flex items-center space-x-1"
          >
            <span>View</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;