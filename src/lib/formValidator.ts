import { z } from "zod";

export const userStatusEnum = z.enum(["Active", "Discontinued", "Paused"]);
export const userRoleEnum = z.enum(["User", "Tutor", "Student", "Admin"]);
export const invoiceStatusEnum = z.enum(["past", "active"]);
export const currencyEnum = z.enum(["USD", "AUD", "INR"]);
export const paymentStatusEnum = z.enum(["pending", "completed", "failed", "refunded", "cancelled"]);
export const classSessionStatusEnum = z.enum(["Pending", "Confirmed", "Reviewing", "Cancelled", "Ongoing", "Completed"]);

export const invoiceItemSchema = z.object({
  hrs: z.number(),
  perHr: z.number(),
  subjects: z.array(z.string()),
});

export const invoiceSchema = z.object({
  userId: z.number(),
  status: invoiceStatusEnum.optional().nullable(),
  amt: z.number().default(0),
  currency: currencyEnum.optional().nullable(),
  isStudent: z.boolean().optional().nullable(),
  invoiceDate: z.coerce.date().optional().nullable(),
  items: z.array(invoiceItemSchema),
});

export const invoiceUpdateSchema = invoiceSchema.partial();

export const userSchema = z.object({
  email: z.string().email().optional().nullable(),
  password: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  emailVerified: z.coerce.date().optional().nullable(),
  userStatus: userStatusEnum.optional().nullable(),
  role: userRoleEnum.optional().nullable(),
  address: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  subjects: z.array(z.string()),
  timezone: z.string().optional().nullable(),
  totalHrs: z.number().optional().nullable(),
  highestQualification: z.string().optional().nullable(),
  parentName: z.string().optional().nullable(),
  parentPhone: z.string().optional().nullable(),
  parentEmail: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  perHr: z.number().optional().nullable(),
  billingCurrency: currencyEnum.optional().nullable(),
});

export const userUpdateSchema = userSchema.partial();

export const paymentSchema = z.object({
  amt: z.number(),
  currency: currencyEnum,
  paymentDate: z.coerce.date().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  razorpayPaymentId: z.string().optional().nullable(),
  razorpayOrderId: z.string().optional().nullable(),
  status: paymentStatusEnum.optional().nullable(),
  invoicesId: z.string().optional().nullable(),
  userId: z.number().optional().nullable(),
});

export const paymentUpdateSchema = paymentSchema.partial();

export const tutorStudentSchema = z.object({
  tutorId: z.number(),
  studentId: z.number(),
  subject: z.string(),
  tutorPerHr: z.number().optional().nullable(),
  tutorCurrency: currencyEnum.optional().nullable(),
  studentPerHr: z.number().optional().nullable(),
  studentCurrency: currencyEnum.optional().nullable(),
  createdAt: z.coerce.date().optional().nullable(),
});

export const tutorStudentUpdateSchema = tutorStudentSchema.partial();

// Updated class session schema to match database requirements
export const classSessionSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  tutorId: z.number().int().positive("Tutor ID must be a positive integer"),
  studentId: z.number().int().positive("Student ID must be a positive integer"),
  startTime: z.coerce.date({ required_error: "Start time is required" }),
  endTime: z.coerce.date({ required_error: "End time is required" }),
  duration: z.number().positive("Duration must be positive"),
  meetLink: z.string().url().optional().nullable(), // Changed from meetlink to meetLink
  topic: z.string().optional().nullable(),
  tutorApprov: z.boolean().optional().nullable(),
  studentApprov: z.boolean().optional().nullable(),
  repeating: z.boolean().optional().nullable(),
  repeatingDay: z.number().int().min(0).max(6).optional().nullable(),
  status: classSessionStatusEnum.optional().nullable(),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

export const classSessionUpdateSchema = classSessionSchema.partial();