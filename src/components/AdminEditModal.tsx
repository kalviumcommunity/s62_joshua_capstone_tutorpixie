"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supportedTimezones } from "@/lib/timezone";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UserType = "tutor" | "student" | string;

interface User {
  id: string | number | null;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  userStatus?: string;
  grade?: string;
  totalHrs?: number;
  timezone?: string;
  subjects?: string[];
  highestQualification?: string;
  perHr?: number | null;
  billingCurrency?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
}

interface AdminEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  userType: UserType;
  onUserUpdate: (user: User) => void;
}

const AdminEditModal: React.FC<AdminEditModalProps> = ({
  isOpen,
  onClose,
  user,
  userType,
  onUserUpdate
}) => {
  const queryClient = useQueryClient();
  const [subjectInput, setSubjectInput] = useState<string>("");
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [editFormData, setEditFormData] = useState<User>({
    id: null,
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    userStatus: "Active",
    grade: "",
    totalHrs: 0.0,
    timezone: "",
    subjects: [],
    highestQualification: "",
    perHr: null,
    billingCurrency: "",
    parentName: "",
    parentPhone: "",
    parentEmail: ""
  });

  const userStatusOptions = ["Active", "Discontinued", "Paused"];

  const { data, isLoading, isError } = useQuery<User | null, Error>({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await axios.get(`/api/user/${user.id}`);
      return res.data?.data ?? null;
    },
    enabled: !!isOpen && !!user?.id
  });

  // Handle side effects for data and error
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load user details.");
    }
    if (data) {
        console.log(data.timezone);
      setEditFormData({
        id: data.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        country: data.country || "",
        city: data.city || "",
        address: data.address || "",
        userStatus: data.userStatus || "Active",
        grade: data.grade || "",
        totalHrs: data.totalHrs || 0.0,
        timezone: data.timezone || "",
        subjects: data.subjects || [],
        highestQualification: data.highestQualification || "",
        perHr: data.perHr ?? 750,
        billingCurrency: data.billingCurrency || "",
        parentName: data.parentName || "",
        parentPhone: data.parentPhone || "",
        parentEmail: data.parentEmail || ""
      });
      setUserSubjects(data.subjects || []);
      setChangedFields(new Set());
    }
  }, [data, isError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setChangedFields((prev) => new Set(prev).add(name));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value !== "" ? parseFloat(value) : null
    }));
    setChangedFields((prev) => new Set(prev).add(name));
  };

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !userSubjects.includes(trimmed)) {
      const updatedSubjects = [...userSubjects, trimmed];
      setUserSubjects(updatedSubjects);
      setSubjectInput("");
      setChangedFields((prev) => new Set(prev).add("subjects"));
    }
  };

  const removeSubject = (subject: string) => {
    const updatedSubjects = userSubjects.filter((s) => s !== subject);
    setUserSubjects(updatedSubjects);
    setChangedFields((prev) => new Set(prev).add("subjects"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  };

  const updateUserMutation = useMutation<User, Error, Partial<User>>({
    mutationFn: async (updatePayload) => {
      const res = await axios.put(`/api/user/${updatePayload.id}/`, updatePayload);
      return res.data.user;
    },
    onSuccess: (updatedUser) => {
      onUserUpdate(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      toast.success("User updated successfully", {style: {color: "green"}});
      onClose();
    },
    onError: () => {
      toast.error("Error updating user");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: Partial<User> = { id: editFormData.id };
    changedFields.forEach((field) => {
      (data as any)[field] = field === "subjects" ? userSubjects : (editFormData as any)[field];
    });

    updateUserMutation.mutate(data);
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-10">
        <DialogHeader>
          <DialogTitle>Edit {userType.charAt(0).toUpperCase() + userType.slice(1)}</DialogTitle>
          <DialogDescription>
            Update the {userType}'s information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="px-1 pb-1">Name</Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="px-1 pb-1">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="px-1 pb-1">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="country" className="px-1 pb-1">Country</Label>
              <Input
                id="country"
                name="country"
                value={editFormData.country}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="px-1 pb-1">City</Label>
              <Input
                id="city"
                name="city"
                value={editFormData.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="address" className="px-1 pb-1">Address</Label>
              <Input
                id="address"
                name="address"
                value={editFormData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userStatus" className="px-1 pb-1">Status</Label>
              <select
                id="userStatus"
                name="userStatus"
                value={editFormData.userStatus}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {userStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="timezone" className="px-1 pb-1">Timezone</Label>
              <select
                id="timezone"
                name="timezone"
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                value={editFormData.timezone}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select timezone</option>
                {supportedTimezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="totalHrs" className="px-1 pb-1">Total Hours</Label>
            <Input
              id="totalHrs"
              name="totalHrs"
              type="number"
              value={editFormData.totalHrs || ""}
              onChange={handleNumberChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects" className="px-1 pb-1">Subjects</Label>
            <div className="flex space-x-2">
              <Input
                id="subjects"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={handleKeyDown}
                placeholder="Add a subject"
              />
              <Button type="button" onClick={addSubject}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {userSubjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{subject}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => removeSubject(subject)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="perHr" className="px-1 pb-1">Rate per Hour</Label>
              <Input
                id="perHr"
                name="perHr"
                type="number"
                value={editFormData.perHr || ""}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              <Label htmlFor="billingCurrency" className="px-1 pb-1">Billing Currency</Label>
              <Input
                id="billingCurrency"
                name="billingCurrency"
                value={editFormData.billingCurrency}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {userType === "tutor" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tutor Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade" className="px-1 pb-1">Grade</Label>
                  <Input
                    id="grade"
                    name="grade"
                    value={editFormData.grade}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="highestQualification" className="px-1 pb-1">Highest Qualification</Label>
                  <Input
                    id="highestQualification"
                    name="highestQualification"
                    value={editFormData.highestQualification}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

        {userType === "student" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Student Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade" className="px-1 pb-1">Grade</Label>
                  <Input
                    id="grade"
                    name="grade"
                    value={editFormData.grade}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="parentName" className="px-1 pb-1">Parent Name</Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    value={editFormData.parentName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="parentPhone" className="px-1 pb-1">Parent Phone</Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    value={editFormData.parentPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="parentEmail" className="px-1 pb-1">Parent Email</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    value={editFormData.parentEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEditModal;