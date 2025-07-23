"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useSession } from "next-auth/react";
import { supportedTimezones } from "@/lib/timezone";
import { toast } from "sonner";

const EditUserForm = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const sessionUser = session?.user;
    const userType = sessionUser?.role;
    const [editedData, setEditedData] = useState({});
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        grades: "",
        highestQualification: "",
        billingCurrency: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        grade: "",
        timezone: ""
    });

    useEffect(() => {
        async function fetchUser() {
            if (!sessionUser?.id) return;
            
            try {
                setLoading(true);
                setError("");
                const res = await axios.get(`/api/user/${sessionUser.id}`);
                const userData = res?.data?.data;
                
                if (userData) {
                    setFormData({
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        country: userData.country || "",
                        city: userData.city || "",
                        address: userData.address || "",
                        grades: userData.grades || "",
                        highestQualification: userData.highestQualification || "",
                        billingCurrency: userData.billingCurrency || "",
                        parentName: userData.parentName || "",
                        parentPhone: userData.parentPhone || "",
                        parentEmail: userData.parentEmail || "",
                        grade: userData.grade || "",
                        timezone: userData.timezone || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setError("Failed to load user data. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        
        fetchUser();
    }, [sessionUser?.id]); // Fixed dependency

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setEditedData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value ? parseInt(value) : null,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        
        try {
            // Success feedback
            toast.promise(
                axios.put("/api/user", editedData),
                {
                    style: {
                        background: "white",
                        color: "green",
                        border: "1px solid green",
                        fontWeight: "800"
                    },
                    loading: "Updating user...",
                    success: "User updated successfully",
                    error: "Error updating user. Please try again.",
                }
            );
            
            setError("");
        } catch (err) {
            console.error("Error updating user:", err);
            setError(err.response?.data?.message || "Error updating user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10">
            <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                    Edit {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User"} Profile
                </h1>
                <p className="text-base text-gray-500 mt-2">Update your personal information and preferences</p>
                </div>

                {/* Error Message */}
                {error && (
                <div className="mx-10 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
                )}

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                {/* Basic Information */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100">
                    Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                        placeholder="Full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                        <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                        placeholder="your@email.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                        placeholder="Phone(with country code)"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                        <Input 
                        id="country" 
                        name="country" 
                        value={formData.country} 
                        onChange={handleChange}
                        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                        placeholder="United States"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                        <Input 
                        id="city" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange}
                        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                        placeholder="New York"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                        <Input 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange}
                        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                        placeholder="123 Main Street"
                        />
                    </div>
                    {/* add two more fields, dropdowns, currencies and timezones */}
                    <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                        <select
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg w-full p-2"
                        >
                        <option value="">Select Time Zone</option>
                        {supportedTimezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                        </select>
                    </div>
                    </div>
                </div>

                {/* Tutor-specific fields */}
                {userType === "Tutor" && (
                    <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100">
                        Tutor Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                        <Label htmlFor="grades" className="text-sm font-medium text-gray-700">Grades Taught</Label>
                        <Input 
                            id="grades" 
                            name="grades" 
                            value={formData.grades} 
                            onChange={handleChange}
                            className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                            placeholder="e.g., upto grade 5"
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="highestQualification" className="text-sm font-medium text-gray-700">Highest Qualification</Label>
                        <Input 
                            id="highestQualification" 
                            name="highestQualification" 
                            value={formData.highestQualification} 
                            onChange={handleChange}
                            className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                            placeholder="e.g., Bachelor's, Master's, PhD"
                        />
                        </div>
                    </div>
                    </div>
                )}

                {/* Student-specific fields */}
                {userType === "Student" && (
                    <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 pb-3 border-b border-gray-100">
                        Student Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                        <Label htmlFor="grade" className="text-sm font-medium text-gray-700">Student Grade</Label>
                        <Input 
                            id="grade" 
                            name="grade" 
                            value={formData.grade} 
                            onChange={handleChange}
                            className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                            placeholder="e.g., 9th Grade"
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="parentName" className="text-sm font-medium text-gray-700">Parent/Guardian Name</Label>
                        <Input 
                            id="parentName" 
                            name="parentName" 
                            value={formData.parentName} 
                            onChange={handleChange}
                            className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                            placeholder="Parent's full name"
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="parentPhone" className="text-sm font-medium text-gray-700">Parent/Guardian Phone</Label>
                        <Input 
                            id="parentPhone" 
                            name="parentPhone" 
                            value={formData.parentPhone} 
                            onChange={handleChange}
                            className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                            placeholder="+91 1234567890 (with country code)"
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="parentEmail" className="text-sm font-medium text-gray-700">Parent/Guardian Email</Label>
                        <Input 
                            id="parentEmail" 
                            name="parentEmail" 
                            value={formData.parentEmail} 
                            onChange={handleChange}
                            className="border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg"
                            placeholder="parent@example.com"
                        />
                        </div>
                    </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-100">
                    <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2 min-w-[140px] rounded-lg shadow transition-all duration-150"
                    >
                    {submitting ? (
                        <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                        </div>
                    ) : (
                        "Save Changes"
                    )}
                    </Button>
                </div>
                </form>
            </div>
            </div>
        </div>
    );
};

export default EditUserForm;