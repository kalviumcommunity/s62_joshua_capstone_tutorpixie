'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { supportedCurrencies } from '@/lib/currency';

const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export function AddPaymentButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    userId: '',
    amt: '',
    currency: 'INR',
    paymentDate: getToday(),
    paymentMethod: '',
    status: 'pending',
    razorpayPaymentId: '',
    razorpayOrderId: '',
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get('/api/user/student');
      return res.data.data;
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/payments', {
        userId: parseInt(form.userId),
        amt: parseFloat(form.amt),
        currency: form.currency,
        paymentDate: new Date(form.paymentDate),
        paymentMethod: form.paymentMethod || undefined,
        status: form.status,
        razorpayPaymentId: form.razorpayPaymentId || undefined,
        razorpayOrderId: form.razorpayOrderId || undefined,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Payment created successfully!');
      queryClient.invalidateQueries(["payments"]);
      setOpen(false);
      setForm({
        userId: '',
        amt: '',
        currency: 'INR',
        paymentDate: getToday(),
        paymentMethod: '',
        status: 'pending',
        razorpayPaymentId: '',
        razorpayOrderId: '',
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create payment.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className='bg-purple-600 hover:bg-purple-800'>Add Payment</Button>
      </DialogTrigger>

        <DialogContent className="max-w-[90vw] sm:max-w-[600px] w-full">
        <DialogHeader>
            <DialogTitle>Create Payment</DialogTitle>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto grid gap-4 py-4 px-1 sm:px-4">
            <div className="grid gap-2">
            <Label>User</Label>
            <select
                name="userId"
                value={form.userId}
                onChange={handleChange}
                className="border rounded px-3 py-2"
            >
                <option value="">Select a user</option>
                {usersLoading ? (
                <option>Loading...</option>
                ) : (
                users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                    {user.name || `User ${user.id}`}
                    </option>
                ))
                )}
            </select>
            </div>

            <div className="grid gap-2">
            <Label>Amount</Label>
            <Input type="number" name="amt" value={form.amt} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
            <Label>Currency</Label>
            <select name="currency" value={form.currency} onChange={handleChange} className="border rounded px-3 py-2">
                {
                    supportedCurrencies.map((curr, index)=>
                        <option value={curr} key={index}>{curr}</option>
                    )
                }
            </select>
            </div>

            <div className="grid gap-2">
            <Label>Status</Label>
            <select name="status" value={form.status} onChange={handleChange} className="border rounded px-3 py-2">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
            </select>
            </div>

            <div className="grid gap-2">
            <Label>Payment Date</Label>
            <Input type="date" name="paymentDate" value={form.paymentDate} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
            <Label>Payment Method</Label>
            <Input name="paymentMethod" value={form.paymentMethod} onChange={handleChange} placeholder="card / upi / netbanking..." />
            </div>

            <div className="grid gap-2">
            <Label>Razorpay Payment ID (optional)</Label>
            <Input name="razorpayPaymentId" value={form.razorpayPaymentId} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
            <Label>Razorpay Order ID (optional)</Label>
            <Input name="razorpayOrderId" value={form.razorpayOrderId} onChange={handleChange} />
            </div>
        </div>

        <DialogFooter className="mt-4">
            <Button onClick={() => createPaymentMutation.mutate()} disabled={createPaymentMutation.isLoading}>
            {createPaymentMutation.isLoading ? 'Creating...' : 'Create Payment'}
            </Button>
        </DialogFooter>
        </DialogContent>

    </Dialog>
  );
}
