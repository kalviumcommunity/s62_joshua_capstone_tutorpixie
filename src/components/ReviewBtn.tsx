"use client";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const reviewSession = async (formData: {topic: string, duration: string}, id: number) =>{
    try {
        console.log(formData);
        const res  = await axios.put(`/api/classes/reviewing/${id}`, formData);
        console.log("Class Reviewed");
        return res.data; 
    } catch (error) {
        console.log("Error in submitting session review:", error);
        throw error; // Re-throw to trigger onError in mutation
    }
}

const ReviewBtn = ({id, duration}: {id: number, duration: number}) => {
    const [reviewModalOpen, setReviewModal] = useState(false);
    const [formData, setFormData] = useState({
        topic: "", 
        duration: duration.toString()
    });
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const reviewMutation = useMutation({
        mutationFn: (data: {topic: string, duration: string}) => reviewSession(data, id),
        onMutate: () => {
            // Optionally show a loading toast
            toast.loading("Submitting review...", { id: "review-submission", duration: Infinity});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['class-reviews']});
            console.log("class reviewed");
            // Reset form and close modal on success
            setFormData({
                topic: "", 
                duration: duration.toString()
            });
            setError(null);
            setReviewModal(false);
            toast.dismiss("review-submission");
            toast.success("Review submitted successfully", {
                id: "review-submission-success",
                duration: 5000,
                style: {
                    color: "green",
                    fontWeight: "bold"
                }
            });
        },
        onError: (error: any) => {
            console.error("Review submission failed:", error);
            // Set error message for display
            const errorMessage = error?.response?.data?.message || 
                               error?.message || 
                               "Failed to submit review. Please try again.";
            setError(errorMessage);
            toast.dismiss("review-submission");
            toast.error(errorMessage, {
                id: "review-submission-error",
                duration: 5000,
                action: {
                    label: "Retry",
                    onClick: () => reviewMutation.mutate(formData) // Retry submission
                }
            });
        }
    });

    async function handleReviewSubmit(e: React.FormEvent){
        e.preventDefault();
        setError(null); // Clear any previous errors
        reviewMutation.mutate(formData);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    const handleModalClose = (open: boolean) => {
        setReviewModal(open);
        if (!open) {
            // Reset form and clear errors when modal is closed
            setFormData({
                topic: "", 
                duration: duration.toString()
            });
            setError(null);
        }
    };

    return <div>
        <button 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg" 
            onClick={() => setReviewModal(true)}
        >
            Review
        </button>
        <Dialog open={reviewModalOpen} onOpenChange={handleModalClose} modal>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Session</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter the session details
                </DialogDescription>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Basic User Information */}
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <label htmlFor="topic">Topic Taken</label>
                            <input 
                                id="topic"
                                name="topic"
                                className="p-2 border-gray-700 border-1 rounded-md"
                                value={formData.topic}
                                onChange={handleInputChange}
                                required
                                disabled={reviewMutation.isPending}
                            />
                        </div>
                        <br />
                                                 
                        <div>
                            <label htmlFor="duration">Duration</label>
                            <select
                                id="duration"
                                name="duration"
                                className="mt-4 w-full p-2 border-gray-700 text-gray-800 rounded-lg"
                                value={formData.duration}
                                onChange={handleInputChange}
                                disabled={reviewMutation.isPending}
                            >
                                <option value="" disabled>Duration</option>
                                <option value="0.5">30 mins</option>
                                <option value="0.75">45 mins</option>
                                <option value="1">1 hour</option>
                                <option value="1.5">1.5 hours</option>
                                <option value="2">2 hours</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button 
                                variant="outline" 
                                type="button"
                                disabled={reviewMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            type="submit"
                            disabled={reviewMutation.isPending}
                        >
                            {reviewMutation.isPending ? "Submitting..." : "Confirm Details"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
}

export default ReviewBtn;