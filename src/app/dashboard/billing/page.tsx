"use client";
import CurrentInvoice from "@/components/billing/CurrentInvoice";
import InvoicesTab from "@/components/billing/InvoicesTab";
import ClassesTab from "@/components/ClassesTab";
import { LoadingComponent } from "@/components/LoadingComponent";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUnbilledSession = async () =>{
    try {
        const res = await axios.get("/api/invoices/sessions/");
        if(!res || !res?.data?.success || !res?.data?.data){
            throw new Error("Error in fetching unbilled sessions");
        }
        console.log(res.data.data);
        return res.data.data;
    } catch (error) {
        console.log(error);
        throw new Error("Error in fetching unbilled sessions");
    }
}

const fetchPastInvoices = async () => {
    try {
        const res = await axios.get("/api/invoices/past");
        if(!res || !res?.data?.success || !res?.data?.data){
            throw new Error("Error in fetching past invoices");
        }
        return res.data.data;
    } catch (error) {
        console.log(error);
        throw new Error("Error in fetching past invoices");
    }
} 

export default function Billing(){

    const {data, isLoading, isError, error} = useQuery({
        queryFn: fetchUnbilledSession,
        queryKey: ['class-invoice']
    })

    const {data: pastInvoices, isLoading: isPastLoading, isError: isPastError, error: pastError} = useQuery({
        queryFn: fetchPastInvoices,
        queryKey: ['past-invoices']
    });
    

return (
  <div className="flex flex-col h-full">
    <CurrentInvoice/>
    
    <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-4 flex-1 overflow-hidden">
      
      {/* Billed Sessions Column */}
      <div className="w-full h-full px-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          {
            !isLoading
              ? <ClassesTab name="Billed Sessions" type="unbilled" apiData={data} />
              : <LoadingComponent title="Billed Sessions" />
          }
        </div>
      </div>

      {/* Past Invoices Column */}
      <div className="w-full h-full px-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          {
            !isPastLoading
              ? <InvoicesTab name="Past invoices" apiData={pastInvoices} />
              : <LoadingComponent title="Past invoices" />
          }
        </div>
      </div>

    </div>
  </div>
);

}