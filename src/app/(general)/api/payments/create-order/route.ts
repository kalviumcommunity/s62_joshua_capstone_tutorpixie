import { NextRequest, NextResponse } from "next/server";
import Razorpay from 'razorpay';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path as needed

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized. Please login to continue."
      }, { status: 401 });
    }

    // Parse request body
    const { amount, currency = "INR" } = await request.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: "Invalid amount. Amount must be greater than 0."
      }, { status: 400 });
    }

    // Generate unique receipt ID
    const receiptId = `receipt_${session.user.id}_${Date.now()}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: currency,
      receipt: receiptId,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    }, { status: 200 });

  } catch (error) {
    console.error("Error in creating Razorpay order:", error);
    
    // Handle specific Razorpay errors
    if (error instanceof Error) {
      // Check if it's a Razorpay API error
      if (error.message.includes('401')) {
        return NextResponse.json({
          success: false,
          error: "Payment gateway authentication failed. Please contact support."
        }, { status: 500 });
      }
      
      if (error.message.includes('400')) {
        return NextResponse.json({
          success: false,
          error: "Invalid payment parameters. Please try again."
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: false,
      error: "Failed to create payment order. Please try again later."
    }, { status: 500 });
  }
}