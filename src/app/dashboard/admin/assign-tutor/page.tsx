"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Trash2, UserPlus } from 'lucide-react';
import axios from 'axios';

// Define the type for our tutor-student subject entry
interface TutorStudentSubject {
  id: number;
  tutor: {name: string, id: number};
  student: {name: string, id: number};
  subject: string;
}

const TutorStudentSubjectsComponent: React.FC = () => {
  const [data, setData] = useState<TutorStudentSubject[]>([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState<{tutor:number, student: number, subject: string}>({
    tutor: 0,
    student: 0,
    subject: ""
  })

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignNewTutor, setIsAssignNewTutor] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchRelations = async () =>{
    try {
      const res = await axios.get('/api/user/relation');
      setData(res.data.data);
    } catch (error) {
      console.log(`Error in fetching tutor-student realtions: ${error}`);
    }
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
    fetchRelations();
    fetchStudents();
    fetchTutors();
    console.log(tutors);
  }, [])


  // Handler for delete confirmation
  const handleDeleteConfirmation = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  // Actual delete handler
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/user/relation/${selectedId}`);
      if (selectedId !== null) {
        setData(data.filter(item => item.id !== selectedId));
        setIsDeleteModalOpen(false);
      }
      console.log("realtion deleted", res);
    } catch (error) {
      console.log(`unable to delete tutor-student relation: ${error}`)
    }
  };

  // Handler for "Assign Tutor" button
  const handleAssignTutor = async (e) => {
    // TODO: Implement assign tutor logic 
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post('/api/user/relation',formData);
      console.log(res.data.data);
      setData(prev=>[...prev, res.data.data])
      setIsAssignNewTutor(false);
    } catch (error) {
      console.log(`unable to update tutor-student relation: ${error}`)
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Tutor Student Subjects
      </h1>

      <div className="mb-4">
        <Button 
          onClick={()=>{setIsAssignNewTutor(prev=>!prev)}}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Assign Tutor
        </Button>
      </div>

      <div className="overflow-x-auto max-h-[50vh]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3 text-left border">ID</th>
              <th className="p-3 text-left border">Tutor</th>
              <th className="p-3 text-left border">Student</th>
              <th className="p-3 text-left border">Subject</th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 border">{item.id}</td>
                <td className="p-3 border">{item.tutor.name}</td>
                <td className="p-3 border">{item.student.name}</td>
                <td className="p-3 border">{item.subject}</td>
                <td className="p-3 border text-center">
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeleteConfirmation(item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
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

      <Dialog open={isAssignNewTutor} onOpenChange={setIsAssignNewTutor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Tutor-Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignTutor} className="space-y-4">
            <div>
              <label 
                htmlFor="tutorId" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tutor
              </label>
              <select 
                name="tutorId" 
                id="tutorId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setFormData(prev=>({...prev, tutor: parseInt(e.target.value)}))}}
              >
                <option value="">Select a Tutor</option>
                {
                  tutors.map((tutor)=>(
                    <option key={tutor.id} value={tutor.id}>{tutor.name}({tutor.id})</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label 
                htmlFor="studentId" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Student
              </label>
              <select 
                name="studentId" 
                id="studentId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setFormData(prev=>({...prev, student: parseInt(e.target.value)}))}}
              >
                <option value="">Select a Student</option>
                {
                  students.map((student)=>(
                    <option key={student.id} value={student.id}>{student.name}({student.id})</option>
                  ))
                }
              </select>
            </div>

            <div>
              <label 
                htmlFor="subjectId" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject
              </label>
              <select 
                name="subjectId" 
                id="subjectId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setFormData(prev=>({...prev, subject: e.target.value}))}}
              >
                <option value="">Select a Subject</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
              </select>
            </div>

            <div className="flex space-x-2 mt-4">
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Assign Tutor
              </button>
              <button 
                type="button"
                onClick={() => setIsAssignNewTutor(false)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorStudentSubjectsComponent;