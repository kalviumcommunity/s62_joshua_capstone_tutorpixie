"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { contactFormSchema } from '@/lib/formValidator';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // React Query mutation for form submission
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/enquiry/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to submit form" }));
        throw new Error(errorData.message || "Failed to submit form.");
      }
      return res.json();
    },
    onSuccess: () => {
      setFormError(null);
      setFieldErrors({});
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      router.replace("/thank-you");
    },
    onError: (error: any) => {
      setFormError(error.message || "Something went wrong. Please try again.");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    setFormError(null);
    setFieldErrors({});

    // Combine subject and message as specified
    const dataToValidate = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined, // Convert empty string to undefined for nullable field
      message: formData.subject && formData.message 
        ? `${formData.subject} - ${formData.message}` 
        : formData.message || undefined, // Convert empty string to undefined for nullable field
    };

    const result = contactFormSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrs: Record<string, string> = {};
      
      if (result.error.issues && Array.isArray(result.error.issues)) {
        result.error.issues.forEach((err) => {
          const fieldName = err.path[0]?.toString();
          if (fieldName && !fieldErrs[fieldName]) {
            fieldErrs[fieldName] = err.message;
          }
        });
      }
      
      setFieldErrors(fieldErrs);
      setFormError("Please fix the highlighted errors.");
      return;
    }

    // Submit form data using React Query mutation
    mutation.mutate(result.data);
  };

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-[#7c7aff]/10 rounded-full mb-4">
            <span className="text-sm font-medium text-[#7c7aff]">Get In Touch</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <p className="text-xl text-gray-600">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {formError && (
            <div className="mb-6 text-red-600 font-normal text-center">
              {formError}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.name ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-[#7c7aff] focus:border-transparent transition-colors`}
                  placeholder="Enter your full name"
                />
                {fieldErrors.name && (
                  <div className="text-xs text-red-600 mt-1">{fieldErrors.name}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-[#7c7aff] focus:border-transparent transition-colors`}
                  placeholder="Enter your email address"
                />
                {fieldErrors.email && (
                  <div className="text-xs text-red-600 mt-1">{fieldErrors.email}</div>
                )}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.phone ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-[#7c7aff] focus:border-transparent transition-colors`}
                  placeholder="Phone number (with country code)"
                />
                {fieldErrors.phone && (
                  <div className="text-xs text-red-600 mt-1">{fieldErrors.phone}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject
                </label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${
                    fieldErrors.subject ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-[#7c7aff] focus:border-transparent transition-colors`}
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Tutoring Services">Tutoring Services</option>
                  <option value="Become a Tutor">Become a Tutor</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing Questions">Billing Questions</option>
                </select>
                {fieldErrors.subject && (
                  <div className="text-xs text-red-600 mt-1">{fieldErrors.subject}</div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border ${
                  fieldErrors.message ? "border-red-500" : "border-gray-200"
                } rounded-lg focus:ring-2 focus:ring-[#7c7aff] focus:border-transparent transition-colors resize-none`}
                placeholder="Tell us how we can help you..."
              />
              {fieldErrors.message && (
                <div className="text-xs text-red-600 mt-1">{fieldErrors.message}</div>
              )}
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className={`inline-flex items-center px-8 py-4 ${
                  mutation.isPending 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#7c7aff] hover:bg-[#6b68ff]"
                } text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl`}
              >
                <Send className="w-5 h-5 mr-2" />
                {mutation.isPending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};