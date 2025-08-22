import React, { useState } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { currencyConfigs } from "@/lib/currency";

interface InvoiceItem {
  hrs: number;
  perHr: number;
  subjects: string[];
}

interface ViewInvoiceItemsButtonProps {
  items?: InvoiceItem[];
  invoiceId: string;
  totalAmount: string;
  currency?: string;
  className?: string;
}

const ViewInvoiceItemsButton: React.FC<ViewInvoiceItemsButtonProps> = ({ 
  items, 
  invoiceId,
  totalAmount,
  currency = "INR",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={`bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-100 active:scale-90 flex items-center justify-center space-x-2 ${className}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>View Invoice Items ({items.length})</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Invoice Items</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Invoice #{invoiceId.substring(0, 8)}
                </h3>
                <p className="text-sm text-gray-600">{items.length} items</p>
              </div>
            </div>
            
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                          <h4 className="font-medium text-gray-900">
                            {item?.subjects?.join(", ") || "No subjects specified"}
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.hrs} hours</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>
                              {currencyConfigs[currency]?.symbol || currency} {item.perHr}/hr
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {currencyConfigs[currency]?.symbol || currency} {(item.hrs * item.perHr).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.hrs} × {item.perHr}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Items Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">Total</h4>
                      <p className="text-sm text-gray-600">
                        {items.reduce((acc, item) => acc + item.hrs, 0)} hours across {items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {totalAmount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No invoice items found.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceItemsButton;