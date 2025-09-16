import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/hooks/usePagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Pencil, Trash2, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

// API functions
const updateUserRole = async (id: string | number, role: string) => {
    const res = await axios.put(`/api/user/${id}`, { role });
    return res.data?.data;
};

interface UserTableProps {
    data: any[];
    title: string;
    userType: string;
    isLoading?: boolean;
    setDeleteUser: (user: { id: number | null, type: string }) => void;
    setCurrentUserType: (type: string) => void;
    setIsDeleteModalOpen: (open: boolean) => void;
    setSelectedUser: (user: any) => void;
    setIsEditModalOpen: (open: boolean) => void;
    pagination?: Pagination;
    currentPage?: number;
    goToPrevPage?: () => void;
    goToNextPage?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({
    data,
    title,
    userType,
    isLoading = false,
    setDeleteUser,
    setCurrentUserType,
    setIsDeleteModalOpen,
    setSelectedUser,
    setIsEditModalOpen,
    pagination,
    currentPage,
    goToPrevPage,
    goToNextPage
}) => {
    const queryClient = useQueryClient();

    // Mutation for adding student role
    const addStudentMutation = useMutation({
        mutationFn: (id: string | number) => updateUserRole(id, "Student"),
        onSuccess: (updatedUser, id) => {
            // Optimistically update the cache
            queryClient.setQueryData(['students'], (oldStudents: any[] = []) => {
                const exists = oldStudents.some(student => student.id === id);
                if (exists) return oldStudents;
                return [...oldStudents, updatedUser];
            });

            // Remove from users list
            queryClient.setQueryData(['users'], (oldUsers: any[] = []) => 
                oldUsers.filter(user => user.id !== id)
            );

            // Invalidate queries to ensure consistency
            queryClient.invalidateQueries(['students']);
            queryClient.invalidateQueries(['users']);

            toast.success("User updated to Student successfully");
        },
        onError: (error: any) => {
            console.error('Add student error:', error);
            toast.error(`Failed to update user to student: ${error.response?.data?.message || error.message}`);
        }
    });

    // Mutation for adding tutor role
    const addTutorMutation = useMutation({
        mutationFn: (id: string | number) => updateUserRole(id, "Tutor"),
        onSuccess: (updatedUser, id) => {
            // Optimistically update the cache
            queryClient.setQueryData(['tutors'], (oldTutors: any[] = []) => {
                const exists = oldTutors.some(tutor => tutor.id === id);
                if (exists) return oldTutors;
                return [...oldTutors, updatedUser];
            });

            // Remove from users list
            queryClient.setQueryData(['users'], (oldUsers: any[] = []) => 
                oldUsers.filter(user => user.id !== id)
            );

            // Invalidate queries to ensure consistency
            queryClient.invalidateQueries(['tutors']);
            queryClient.invalidateQueries(['users']);

            toast.success("User updated to Tutor successfully");
        },
        onError: (error: any) => {
            console.error('Add tutor error:', error);
            toast.error(`Failed to update user to tutor: ${error.response?.data?.message || error.message}`);
        }
    });

    const addStudent = (id: string | number) => {
        if (!id) return;
        addStudentMutation.mutate(id);
    };

    const addTutor = (id: string | number) => {
        if (!id) return;
        addTutorMutation.mutate(id);
    };

    const isMutating = addStudentMutation.isLoading || addTutorMutation.isLoading;
    const tableLoading = isLoading || isMutating;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                {/* Header with title + pagination */}
                {(pagination && !!goToNextPage && !!goToPrevPage && currentPage) ? (
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-2xl text-gray-900">{title}</h2>
                        <div className="flex items-center space-x-2">
                            <button
                                className="px-1 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                                onClick={goToPrevPage}
                                disabled={!pagination?.hasPrevPage}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-gray-400">
                                {currentPage} / {pagination?.totalPages || 1}
                            </span>
                            <button
                                className="px-1 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                                onClick={goToNextPage}
                                disabled={!pagination?.hasNextPage}
                            >
                                <ChevronRight className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <h2 className="font-bold text-2xl text-gray-900">{title}</h2>
                )}
            </div>
            
            <div className="overflow-auto max-h-[50vh]">
                <table className="w-full">
                    <thead className="sticky top-0 bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Country</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    {tableLoading ? "Loading..." : `No ${title.toLowerCase()} found`}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.id} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.id}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.country || "—"}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={item.userStatus} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2 justify-center">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="h-8 w-8 p-0 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                onClick={() => {
                                                    setDeleteUser({ id: item.id, type: userType });
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                disabled={tableLoading}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="h-8 w-8 p-0 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                onClick={() => {
                                                    setSelectedUser(item);
                                                    setCurrentUserType(userType);
                                                    setIsEditModalOpen(true);
                                                }}
                                                disabled={tableLoading}
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            {userType === 'user' && (
                                                <>
                                                    <Button 
                                                        variant="default" 
                                                        size="sm"
                                                        className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
                                                        onClick={() => addTutor(item.id)}
                                                        disabled={tableLoading}
                                                    >
                                                        <UserPlus className="w-3.5 h-3.5 mr-1"/>
                                                        {addTutorMutation.isLoading ? "..." : "Tutor"}
                                                    </Button>
                                                    <Button 
                                                        variant="default"
                                                        size="sm"
                                                        className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white shadow-sm disabled:opacity-50"
                                                        onClick={() => addStudent(item.id)}
                                                        disabled={tableLoading}
                                                    >
                                                        <UserPlus className="w-3.5 h-3.5 mr-1"/>
                                                        {addStudentMutation.isLoading ? "..." : "Student"}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;