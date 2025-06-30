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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ReviewBtn = ({id, duration}: {id: number, duration: number}) => {
    const [reviewModalOpen, setReviewModal] = useState(false);
    const [formData, setFormData] = useState({
        topic: "", 
        duration: duration.toString()
    })

    useEffect(()=>{
        console.log("duration", duration);
    }, [])

    async function handleReviewSubmit(e: React.FormEvent){
        e.preventDefault(); // Prevent form from refreshing the page
        console.log(formData);
        try {
            await axios.put(`/api/classes/reviewing/${id}`, formData);
            console.log("Class Reviewed"); 
        } catch (error) {
            console.log("Error in submitting session review:", error);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return <div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg" onClick={()=>{setReviewModal(true)}}>Review</button>
        <Dialog open={reviewModalOpen} onOpenChange={setReviewModal} modal>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Session</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter the session details
                </DialogDescription>

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
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Confirm Details</Button>
                        </DialogFooter>
                    </form>
             </DialogContent>
        </Dialog>
    </div>
}

export default ReviewBtn;