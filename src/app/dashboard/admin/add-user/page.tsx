"use client";

import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Trash2, UserPlus, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddUsers(){
    const [tutors, setTutors] = useState([]);
    const [students, setStudents] = useState([]);
    const [users, setUsers] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteUser, setDeleteUser] = useState({id:null, type: ""});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUserType, setCurrentUserType] = useState("");
    const [subjectInput, setSubjectInput] = useState("");
    const [userSubjects, setUserSubjects] = useState([]);
    const [editFormData, setEditFormData] = useState({
        id: null,
        name: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        userStatus: "Active",
        // Tutor specific fields
        grades: "",
        highestQualification: "",
        perHr: null,
        billingCurrency: "",
        // Student specific fields
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        grade: "",
    });
    
    const userStatusOptions = ["Active", "Discontinued", "Paused"];

    const fetchUsers = async () => {
        const res = await axios.get('/api/user/user');
        setUsers(res.data?.data || []);
    }
    
    const fetchTutors = async () => {
        const res = await axios.get('/api/user/tutor');
        setTutors(res.data?.data || []);
    }
    
    const fetchStudents = async () => {
        const res = await axios.get('/api/user/student');
        setStudents(res.data?.data || []);
    }

    useEffect(() => {
        fetchUsers();
        fetchTutors();
        fetchStudents();
    }, []);

    const handleDelete = async () => {
        try {
            const id = deleteUser.id;
            let res;
            if(deleteUser.type === "user"){
                res = await axios.delete(`/api/user/`, {
                    data: { id: id },
                });
            } else {
                res = await axios.delete(`/api/user/${id}`);
            }
            setIsDeleteModalOpen(false);
            switch(deleteUser.type){
                case 'tutor':
                    setTutors((prev) => prev.filter((u) => u.id !== id));
                    break;
                case "student":
                    setStudents((prev) => prev.filter((u) => u.id !== id));
                    break;
                case "user":
                    setUsers((prev) => prev.filter((u) => u.id !== id));
                    break;
                default:
                    setTutors((prev) => prev.filter((u) => u.id !== id));
                    setStudents((prev) => prev.filter((u) => u.id !== id));
                    setUsers((prev) => prev.filter((u) => u.id !== id));
                    break;
            }
        } catch (error) {
            alert('Error deleting the user');
            console.error(error.message);
        }
    }

    const addStudent = async (id) => {
        try {
            const res = await axios.put(`/api/user/${id}`, {role: "Student"});
            setStudents((prev) => [...prev, res.data.user]);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            alert('Error in updating the user');
            console.error(error.message);
        }
    }

    const addTutor = async (id) => {
        try {
            const res = await axios.put(`/api/user/${id}`, {role: "Tutor"});
            setTutors((prev) => [...prev, res.data.user]);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            alert('Error in updating the user');
            console.error(error.message);
        }
    }

    const openEditModal = (user, type) => {
        setCurrentUserType(type);
        
        // Reset form with current user data
        setEditFormData({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            country: user.country || "",
            city: user.city || "",
            address: user.address || "",
            userStatus: user.userStatus || "Active",
            // Tutor specific fields
            grades: user.grades || "",
            highestQualification: user.highestQualification || "",
            perHr: user.perHr || null,
            billingCurrency: user.billingCurrency || "",
            // Student specific fields
            parentName: user.parentName || "",
            parentPhone: user.parentPhone || "",
            parentEmail: user.parentEmail || "",
            grade: user.grade || "",
        });
        
        setUserSubjects(user.subjects || []);
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value ? parseInt(value) : null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create data object with form data and subjects
            const data = {
                ...editFormData,
                subjects: userSubjects
            };
            
            const res = await axios.put(`/api/user/${data.id}`, data);
            
            // Update the appropriate list based on user type
            if (currentUserType === "tutor") {
                setTutors(prev => prev.map(user => user.id === data.id ? res.data.user : user));
            } else if (currentUserType === "student") {
                setStudents(prev => prev.map(user => user.id === data.id ? res.data.user : user));
            } else {
                setUsers(prev => prev.map(user => user.id === data.id ? res.data.user : user));
            }
            
            setIsEditModalOpen(false);
            alert("User updated successfully");
        } catch (error) {
            alert('Error updating user');
            console.error(error.message);
        }
    };

    const addSubject = () => {
        if (subjectInput.trim() !== "" && !userSubjects.includes(subjectInput.trim())) {
            setUserSubjects([...userSubjects, subjectInput.trim()]);
            setSubjectInput("");
        }
    };

    const removeSubject = (subject) => {
        setUserSubjects(userSubjects.filter(s => s !== subject));
    };

    return (
        <>        
            <div className="flex flex-col">
                <div className="grid-rows-1 grid-cols-2 gap-4 grid p-4"> 
                    <div id='tutor-list' className="overflow-auto">
                        <h2 className="font-bold text-2xl h-8">Tutors</h2>
                        <div className="overflow-x-auto max-h-[50vh]">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="bg-blue-100">
                                        <th className="p-3 text-left border-gray-300 border-2">ID</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Name</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Country</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Status</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tutors.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="p-1 border-gray-300 border-2">{item.id}</td>
                                            <td className="p-1 border-gray-300 border-2"><b>{item.name}</b></td>
                                            <td className="p-1 border-gray-300 border-2">{item.country || "NA"}</td>
                                            <td className="p-1 border-gray-300 border-2">{item.userStatus || "Active"}</td>
                                            <td className="p-1 border-gray-300 border-2 flex gap-2 justify-center">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon"
                                                    className="border-black border-[1px]"
                                                    onClick={() => {setDeleteUser({id: item.id, type: 'tutor'}); setIsDeleteModalOpen(true);}}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon"
                                                    className="border-black border-[1px]"
                                                    onClick={() => openEditModal(item, "tutor")}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id='student-list' className="overflow-auto">
                        <h2 className="font-bold text-2xl h-8">Students</h2>
                        <div className="overflow-x-auto max-h-[50vh]">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="bg-blue-100">
                                        <th className="p-3 text-left border-gray-300 border-2">ID</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Name</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Country</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Status</th>
                                        <th className="p-3 text-left border-gray-300 border-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-1 border-gray-300 border-2">{item.id}</td>
                                        <td className="p-1 border-gray-300 border-2"><b>{item.name}</b></td>
                                        <td className="p-1 border-gray-300 border-2">{item.country || "NA"}</td>
                                        <td className="p-1 border-gray-300 border-2">{item.userStatus || "Active"}</td>
                                        <td className="p-1 border-gray-300 border-2 flex gap-2 justify-center">
                                            <Button
                                                variant="outline" 
                                                size="icon"
                                                className="border-black border-[1px]"
                                                onClick={() => {setDeleteUser({id: item.id, type: 'student'}); setIsDeleteModalOpen(true)}}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                className="border-black border-[1px]"
                                                onClick={() => openEditModal(item, "student")}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <h2 className="font-bold text-2xl h-8">Users</h2>
                    <div className="overflow-x-auto max-h-[50vh]">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-white">
                                <tr className="bg-blue-100">
                                    <th className="p-3 text-left border-gray-300 border-2">ID</th>
                                    <th className="p-3 text-left border-gray-300 border-2">Name</th>
                                    <th className="p-3 text-left border-gray-300 border-2">Email</th>
                                    <th className="p-3 text-left border-gray-300 border-2">Phone</th>
                                    <th className="p-3 text-left border-gray-300 border-2">Country</th>
                                    <th className="p-3 text-left border-gray-300 border-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-1 border-gray-300 border-2">{item.id}</td>
                                        <td className="p-1 border-gray-300 border-2"><b>{item.name}</b></td>
                                        <td className="p-1 border-gray-300 border-2">{item.email}</td>
                                        <td className="p-1 border-gray-300 border-2">{item.phone || "NA"}</td>
                                        <td className="p-1 border-gray-300 border-2">{item.country || "NA"}</td>
                                        <td className="p-1 border-gray-300 border-2 flex gap-2 justify-center">
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                className="border-black border-[1px]"
                                                onClick={() => {setDeleteUser({id: item.id, type: 'user'}); setIsDeleteModalOpen(true)}}
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                className="border-black border-[1px]"
                                                onClick={() => openEditModal(item, "user")}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="default" 
                                                className="text-xs"
                                                onClick={()=>{addTutor(item.id)}}
                                            >
                                                <UserPlus className="w-4 h-4 mr-1"/>
                                                Tutor
                                            </Button>
                                            <Button 
                                                variant="default"
                                                className="text-xs"
                                                onClick={()=>{addStudent(item.id)}}
                                            >
                                                <UserPlus className="w-4 h-4 mr-1"/>
                                                Student
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} modal>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                    Are you sure you want to delete this {deleteUser.type}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                    Delete
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen} modal>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit {currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)}</DialogTitle>
                        <DialogDescription>
                            Update the {currentUserType}'s information below.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Basic User Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                    id="name"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={editFormData.email || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input 
                                    id="phone"
                                    name="phone"
                                    value={editFormData.phone || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Input 
                                    id="country"
                                    name="country"
                                    value={editFormData.country || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input 
                                    id="city"
                                    name="city"
                                    value={editFormData.city || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input 
                                    id="address"
                                    name="address"
                                    value={editFormData.address || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* User Status */}
                        <div>
                            <Label>Status</Label>
                            <RadioGroup 
                                value={editFormData.userStatus}
                                onValueChange={(value) => setEditFormData({...editFormData, userStatus: value})}
                                className="flex space-x-4"
                            >
                                {userStatusOptions.map((status) => (
                                    <div key={status} className="flex items-center space-x-2">
                                        <RadioGroupItem value={status} id={status} />
                                        <Label htmlFor={status}>{status}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Subjects */}
                        <div className="space-y-2">
                            <Label htmlFor="subjects">Subjects</Label>
                            <div className="flex space-x-2">
                                <Input 
                                    id="subjects"
                                    value={subjectInput}
                                    onChange={(e) => setSubjectInput(e.target.value)}
                                    placeholder="Add a subject"
                                />
                                <Button type="button" onClick={addSubject}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {userSubjects.map((subject, index) => (
                                    <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
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

                        {/* Tutor specific fields */}
                        {currentUserType === "tutor" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Tutor Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="grades">Grades</Label>
                                        <Input 
                                            id="grades"
                                            name="grades"
                                            value={editFormData.grades || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="highestQualification">Highest Qualification</Label>
                                        <Input 
                                            id="highestQualification"
                                            name="highestQualification"
                                            value={editFormData.highestQualification || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="perHr">Rate per Hour</Label>
                                        <Input 
                                            id="perHr"
                                            name="perHr"
                                            type="number"
                                            value={editFormData.perHr || ""}
                                            onChange={handleNumberChange}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="billingCurrency">Billing Currency</Label>
                                        <Input 
                                            id="billingCurrency"
                                            name="billingCurrency"
                                            value={editFormData.billingCurrency || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Student specific fields */}
                        {currentUserType === "student" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Student Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="parentName">Parent Name</Label>
                                        <Input 
                                            id="parentName"
                                            name="parentName"
                                            value={editFormData.parentName || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="parentPhone">Parent Phone</Label>
                                        <Input 
                                            id="parentPhone"
                                            name="parentPhone"
                                            value={editFormData.parentPhone || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="parentEmail">Parent Email</Label>
                                        <Input 
                                            id="parentEmail"
                                            name="parentEmail"
                                            type="email"
                                            value={editFormData.parentEmail || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="grade">Grade</Label>
                                        <Input 
                                            id="grade"
                                            name="grade"
                                            value={editFormData.grade || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}