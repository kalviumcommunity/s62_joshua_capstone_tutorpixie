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
import axios from "axios";
import { Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddUsers(){
    const [tutors, setTutors] =  useState([]);
    const [students, setStudents] =  useState([]);
    const [users, setUsers] =  useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteUser, setDeleteUser] = useState({id:null, type: ""});

    const fetchUsers = async () => {
        const res = await axios.get('/api/user/user');
        setUsers(res.data?.data||[]);
        console.log("users",res.data?.data);
    }
    const fetchTutors = async () => {
        const res = await axios.get('/api/user/tutor');
        setTutors(res.data?.data||[]);
        console.log("tutors", res.data?.data);
    }
    const fetchStudents = async () => {
        const res = await axios.get('/api/user/student');
        setStudents(res.data?.data||[]);
        console.log("students", res.data?.data);
    }

    useEffect(()=>{
        fetchUsers();
        fetchTutors();
        fetchStudents();
    }, [])

    const handleDelete = async () => {
        try {
            const id  = deleteUser.id;
            let res;
            if(deleteUser.type=="user"){
                res = await axios.delete(`/api/user/`, {
                    data: { id: id },
                  });
            }else{
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
            console.log(res);
        } catch (error) {
            alert('error in updating the user');
            console.log(error.message);
        }
    }

    const addStudent = async (id: number) => {
        try {
            const res = await axios.put(`/api/user/${id}`, {role: "Student"});
            setStudents((prev) => [...prev, res.data.user]);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            console.log(res);
        } catch (error) {
            alert('error in updating the user');
            console.log(error.message);
        }
    }

    const addTutor = async (id: number) => {
        try {
            const res = await axios.put(`/api/user/${id}`, {role: "Tutor"});
            setTutors((prev) => [...prev, res.data.user]);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            console.log(res);
        } catch (error) {
            alert('error in updating the user');
            console.log(error.message);
        }
    }

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
                                        <th className="p-3 text-left border-gray-300 border-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tutors.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="p-1 border-gray-300 border-2">{item.id}</td>
                                            <td className="p-1 border-gray-300 border-2"><b>{item.name}</b></td>
                                            <td className="p-1 border-gray-300 border-2">{item.country}</td>
                                            <td className="p-1 border-gray-300 border-2 text-center">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon"
                                                    className="border-black border-[1px]"
                                                    onClick={() => {setDeleteUser({id: item.id, type: 'tutor'}); setIsDeleteModalOpen(true);}}
                                                >
                                                    <Trash2 className="w-5 h-4" />
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
                                        <th className="p-3 text-left border-gray-300 border-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-1 border-gray-300 border-2">{item.id}</td>
                                        <td className="p-1 border-gray-300 border-2"><b>{item.name}</b></td>
                                        <td className="p-1 border-gray-300 border-2">{item.country}</td>
                                        <td className="p-1 border-gray-300 border-2 text-center">
                                        {item.userStatus=="Active"?<Button
                                            variant="outline" 
                                            size="icon"
                                            className="border-black border-[1px]"
                                            onClick={() => {setDeleteUser({id: item.id, type: 'student'}); setIsDeleteModalOpen(true)}}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>:(item.userStatus)
                                        }
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
                                        <td className="p-1 border-gray-300 border-2">{item.phone?item.phone:"NA"}</td>
                                        <td className="p-1 border-gray-300 border-2">{item.country?item.country:"NA"}</td>
                                        <td className="p-1 border-gray-300 border-2 flex justify-around">
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                className="border-black border-[1px]"
                                                onClick={() => {setDeleteUser({id: item.id, type: 'user'}); setIsDeleteModalOpen(true)}}
                                            >
                                                <Trash2/>
                                            </Button>
                                            <Button 
                                                variant="default" 
                                                onClick={()=>{addTutor(item.id)}}
                                            >
                                                <UserPlus/>
                                                Tutor
                                            </Button>
                                            <Button 
                                                variant="default" 
                                                onClick={()=>{addStudent(item.id)}}
                                            >
                                                <UserPlus/>
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

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} modal>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                    Are you sure you want to delete this tutor-student subject entry?
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
        </>
    )
}