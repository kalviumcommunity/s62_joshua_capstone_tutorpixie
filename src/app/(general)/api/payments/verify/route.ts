import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path as needed
import { prisma } from "@/lib/db";
import { razorpay } from "../create-order/route";

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  invoiceId?: string;
}

// Helper function to map currency string to enum
function mapCurrencyToEnum(currencyString: string): 'USD' | 'AUD' | 'INR' {
  const upperCurrency = currencyString.toUpperCase();
  if (upperCurrency === 'USD' || upperCurrency === 'AUD' || upperCurrency === 'INR') {
    return upperCurrency as 'USD' | 'AUD' | 'INR';
  }
  return 'INR'; // Default fallback
}

export async function POST(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized. Please login to continue."
      }, { status: 401 });
    }

    // Parse request body
    const body: VerifyPaymentRequest = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({
        success: false,
        error: "Missing required payment verification parameters."
      }, { status: 400 });
    }

    // Create signature for verification
    const body_to_verify = razorpay_order_id + "|" + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body_to_verify.toString())
      .digest('hex');

    // Verify signature
    const is_authentic = expected_signature === razorpay_signature;

    // Fetch payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    // Convert user ID to number (assuming it should be Int based on schema)
    const userId = typeof session.user.id === 'string' 
      ? parseInt(session.user.id) 
      : session.user.id;

    if (!is_authentic) {
      console.error(`Payment verification failed for order: ${razorpay_order_id}`);
      
      // Create failed payment record
      await prisma.payments.create({
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          status: 'failed',
          paymentMethod: paymentDetails.method || 'unknown',
          paymentDate: new Date(paymentDetails.created_at * 1000),
          amt: typeof paymentDetails.amount === 'string' 
            ? parseFloat(paymentDetails.amount) / 100 
            : (paymentDetails.amount || 0) / 100,
          currency: mapCurrencyToEnum(paymentDetails.currency || 'INR'),
          invoicesId: invoiceId || null,
          userId: userId || null,
        }
      });

      return NextResponse.json({
        success: false,
        error: "Payment verification failed. Invalid signature."
      }, { status: 400 });
    }

    // Payment is authentic, create successful payment record
    await prisma.payments.create({
      data: {
        amt: typeof paymentDetails.amount === 'string' 
          ? parseFloat(paymentDetails.amount) / 100 
          : (paymentDetails.amount || 0) / 100,
        currency: mapCurrencyToEnum(paymentDetails.currency || 'INR'),
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        status: 'completed',
        paymentMethod: paymentDetails.method || 'unknown',
        paymentDate: new Date(paymentDetails.created_at * 1000),
        invoicesId: invoiceId || null,
        userId: userId || null,
      }
    });

    // Only update invoice if invoiceId is provided
    if (invoiceId) {
      await prisma.invoices.update({
        where: {
          id: invoiceId,
        },
        data: {
          status: 'past'
        }
      });
    }

    console.log(`Payment and invoice updated successfully for order: ${razorpay_order_id}`);
    
    return NextResponse.json({
      success: true,
      message: "Payment verified and processed successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error in payment verification:", error);
    
    // If there's a specific error message, include it for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json({
      success: false,
      error: "Payment verification failed. Please contact support.",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}