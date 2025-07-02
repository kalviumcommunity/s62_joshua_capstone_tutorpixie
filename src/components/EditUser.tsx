"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useSession } from "next-auth/react";
import { supportedTimezones } from "@/lib/timezone";
import { supportedCurrencies } from "@/lib/currency";

const EditUserForm = ({ onUserUpdate = () => {} }) => {
    const [subjectInput, setSubjectInput] = useState("");
    const [userSubjects, setUserSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const sessionUser = session?.user;
    const userType = sessionUser?.role;
    
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        // userStatus: "Active",
        grades: "",
        highestQualification: "",
        perHr: null,
        billingCurrency: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        grade: "",
        timezone: "IST"
    });

    // const userStatusOptions = ["Active", "Discontinued", "Paused"];

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
                        id: userData.id,
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        country: userData.country || "",
                        city: userData.city || "",
                        address: userData.address || "",
                        // userStatus: userData.userStatus || "Active",
                        grades: userData.grades || "",
                        highestQualification: userData.highestQualification || "",
                        perHr: userData.perHr || null,
                        billingCurrency: userData.billingCurrency || "",
                        parentName: userData.parentName || "",
                        parentPhone: userData.parentPhone || "",
                        parentEmail: userData.parentEmail || "",
                        grade: userData.grade || "",
                        timezone: userData.timezone || 'IST',
                    });
                    setUserSubjects(userData.subjects || []);
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
            const data = {
                ...formData,
                subjects: userSubjects,
            };

            const res = await axios.put("/api/user", data);

            if (onUserUpdate) {
                onUserUpdate(res.data.user || res.data, userType);
            }

            // Success feedback
            setError("");
            alert("User updated successfully");
        } catch (err) {
            console.error("Error updating user:", err);
            setError(err.response?.data?.message || "Error updating user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const addSubject = () => {
        const trimmed = subjectInput.trim();
        if (trimmed && !userSubjects.includes(trimmed)) {
            setUserSubjects(prev => [...prev, trimmed]);
            setSubjectInput("");
        }
    };

    const removeSubject = (subject) => {
        setUserSubjects(prev => prev.filter(s => s !== subject));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSubject();
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100">
                        <h1 className="text-2xl font-light text-gray-900">
                            Edit {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User"} Profile
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Update your personal information and preferences</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-100">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
                                        placeholder="123 Main Street"
                                    />
                                </div>
                                {/* add two more fields, dropdowns, currencies and timezones */}
                                <div className="space-y-4">
                                    <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                                    <select
                                        id="timezone"
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0 w-full p-2 rounded-md"
                                    >
                                        <option value="" disabled>Select Time Zone</option>
                                        {supportedTimezones.map(tz => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* <div className="space-y-4">
                                    <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                                    <select
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="border-gray-200 focus:border-gray-400 focus:ring-0 w-full p-2 rounded-md"
                                    >
                                        <option value="" disabled>Select Currency</option>
                                        {supportedCurrencies.map(currency => (
                                            <option key={currency} value={currency}>{currency}</option>
                                        ))}
                                    </select>
                                </div> */}
                            </div>
                        </div>

                        {/* Status */}
                        {/* <div className="space-y-4">
                            <Label className="text-sm font-medium text-gray-700">Account Status</Label>
                            <RadioGroup
                                value={formData.userStatus}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, userStatus: value }))}
                                className="flex gap-6"
                            >
                                {userStatusOptions.map((status) => (
                                    <div key={status} className="flex items-center space-x-2">
                                        <RadioGroupItem value={status} id={status} className="border-gray-300" />
                                        <Label htmlFor={status} className="text-sm text-gray-700 font-normal cursor-pointer">
                                            {status}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div> */}

                        {/* Subjects */}
                        {/* <div className="space-y-4">
                            <Label htmlFor="subjects" className="text-sm font-medium text-gray-700">Subjects</Label>
                            <div className="flex gap-3">
                                <Input
                                    id="subjects"
                                    value={subjectInput}
                                    onChange={(e) => setSubjectInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a subject"
                                    className="flex-1 border-gray-200 focus:border-gray-400 focus:ring-0"
                                />
                                <Button 
                                    type="button" 
                                    onClick={addSubject} 
                                    variant="outline"
                                    className="border-gray-200 hover:bg-gray-50"
                                >
                                    Add
                                </Button>
                            </div>
                            {userSubjects.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {userSubjects.map((subject, i) => (
                                        <div key={i} className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                            <span>{subject}</span>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                onClick={() => removeSubject(subject)}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div> */}


                        {/* Tutor-specific fields */}
                        {userType === "Tutor" && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-100">
                                    Tutor Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="grades" className="text-sm font-medium text-gray-700">Grades Taught</Label>
                                        <Input 
                                            id="grades" 
                                            name="grades" 
                                            value={formData.grades} 
                                            onChange={handleChange}
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
                                            placeholder="e.g., Bachelor's, Master's, PhD"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="perHr" className="text-sm font-medium text-gray-700">Rate per Hour</Label>
                                        <Input 
                                            id="perHr" 
                                            name="perHr" 
                                            type="number" 
                                            min="0" 
                                            value={formData.perHr || ""} 
                                            onChange={handleNumberChange}
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="billingCurrency" className="text-sm font-medium text-gray-700">Currency</Label>
                                        <Input 
                                            id="billingCurrency" 
                                            name="billingCurrency" 
                                            value={formData.billingCurrency} 
                                            onChange={handleChange}
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
                                            placeholder="USD/INR/AUD"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Student-specific fields */}
                        {userType === "Student" && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-100">
                                    Student Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="parentName" className="text-sm font-medium text-gray-700">Parent/Guardian Name</Label>
                                        <Input 
                                            id="parentName" 
                                            name="parentName" 
                                            value={formData.parentName} 
                                            onChange={handleChange}
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
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
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
                                            placeholder="parent@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="grade" className="text-sm font-medium text-gray-700">Current Grade</Label>
                                        <Input 
                                            id="grade" 
                                            name="grade" 
                                            value={formData.grade} 
                                            onChange={handleChange}
                                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
                                            placeholder="e.g., 9th Grade"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2 min-w-[120px]"
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