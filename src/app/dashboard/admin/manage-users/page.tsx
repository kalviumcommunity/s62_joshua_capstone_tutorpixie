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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import AdminEditModal from "@/components/AdminEditModal";
import UserTable from "@/components/UserTable";
import { usePagination } from "@/hooks/usePagination";

// API functions
const fetchTutors = async (page: number, limit: number) => {
    const res = await axios.get(`/api/user/tutor?page=${page}&limit=${limit}`);
    return res.data;
};

const fetchStudents = async (page: number, limit: number) => {
    const res = await axios.get(`/api/user/student?page=${page}&limit=${limit}`);
    return res.data;
};

const deleteUser = async (id: string) => {
    await axios.delete(`/api/user/${id}`);
};

export default function TutorsStudentsPage() {
    const queryClient = useQueryClient();
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteUserData, setDeleteUserData] = useState({id: null, type: ""});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUserType, setCurrentUserType] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    // Pagination hooks
    const {data: tutors, isLoading: tutorsLoading, error: tutorsError, pagination: tutorPagination, currentPage: tutorPage, goToPrevPage: goToPrevTutor, goToNextPage: goToNextTutor} = usePagination({
        initialPageSize: 11,
        queryKey: 'tutors', 
        fetchFn: fetchTutors
    })

    const {data: students, isLoading: studentsLoading, error: studentsError, pagination: studentPagination, currentPage: studentPage, goToPrevPage: goToPrevStudent, goToNextPage: goToNextStudent} = usePagination({
        initialPageSize: 11,
        queryKey: 'students', 
        fetchFn: fetchStudents
    })
    
    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            // Invalidate and refetch the appropriate queries
            switch(deleteUserData.type) {
                case 'tutor':
                    queryClient.invalidateQueries(['tutors']);
                    break;
                case "student":
                    queryClient.invalidateQueries(['students']);
                    break;
                default:
                    // Refresh all data if type is unclear
                    queryClient.invalidateQueries(['tutors']);
                    queryClient.invalidateQueries(['students']);
                    break;
            }
            
            setIsDeleteModalOpen(false);
            setDeleteUserData({id: null, type: ""});
            toast.success(`${deleteUserData.type} deleted successfully`);
        },
        onError: (error) => {
            console.error('Delete error:', error);
            toast.error('Failed to delete user');
        }
    });

    const handleDelete = () => {
        if (!deleteUserData.id) return;
        deleteMutation.mutate(deleteUserData.id);
    };

    const onUserUpdate = async (updatedUser) => {
        if (!updatedUser || !updatedUser.id) {
            console.error('Invalid user data received for update');
            toast.error('Invalid user data');
            return;
        }

        try {
            // Update the cache optimistically
            const queryKey = currentUserType === "tutor" ? ['tutors'] : ['students'];
            
            queryClient.setQueryData(queryKey, (oldData: any[]) => {
                return oldData?.map(user => 
                    user.id === updatedUser.id ? { ...user, ...updatedUser } : user
                ) || [];
            });
            
            // Close the edit modal
            setIsEditModalOpen(false);
            setSelectedUser(null);
            setCurrentUserType("");
            
        } catch (error) {
            console.error('Update sync error:', error);
            toast.error('Failed to sync user data');
        }
    };

    const isLoading = tutorsLoading || studentsLoading || deleteMutation.isLoading;

    return (
        <>        
            <div className="flex flex-col bg-gray-50 h-full max-h-screen">
                <div className="grid grid-rows-1 grid-cols-2 gap-6 p-6"> 
                    {/* Tutors Table */}
                    <div className="flex flex-col">
                        <UserTable 
                            data={tutors} 
                            title="Tutors" 
                            userType="tutor" 
                            isLoading={isLoading} 
                            setDeleteUser={setDeleteUserData} 
                            setCurrentUserType={setCurrentUserType} 
                            setIsDeleteModalOpen={setIsDeleteModalOpen} 
                            setSelectedUser={setSelectedUser} 
                            setIsEditModalOpen={setIsEditModalOpen} 
                            pagination={tutorPagination}
                            currentPage={tutorPage}
                            goToPrevPage={goToPrevTutor}
                            goToNextPage={goToNextTutor}
                        />
                    </div>

                    {/* Students Table */}
                    <div>
                        <UserTable 
                            data={students} 
                            title="Students" 
                            userType="student" 
                            isLoading={isLoading} 
                            setDeleteUser={setDeleteUserData} 
                            setCurrentUserType={setCurrentUserType} 
                            setIsDeleteModalOpen={setIsDeleteModalOpen} 
                            setSelectedUser={setSelectedUser} 
                            setIsEditModalOpen={setIsEditModalOpen} 
                            pagination={studentPagination}
                            currentPage={studentPage}
                            goToPrevPage={goToPrevStudent}
                            goToNextPage={goToNextStudent}
                        />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} modal>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this {deleteUserData.type}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={deleteMutation.isLoading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete} 
                            disabled={deleteMutation.isLoading}
                        >
                            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            {isEditModalOpen && selectedUser?.id && 
                <AdminEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                        setCurrentUserType("");
                    }}
                    user={selectedUser}
                    userType={currentUserType}
                    onUserUpdate={onUserUpdate}
                />
            }
        </>
    );
}