'use client';

import { useState, useEffect } from 'react';

interface Student {
  _id: string;
  fullName: string;
  fatherName: string;
  fatherMobile: string;
  targetClass: string;
  section: string;
  house: string;
  feeStatus: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from MongoDB API
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (data.success) {
          setStudents(data.data);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  if (loading) return <div className="p-8">Loading students...</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Students Directory</h1>
      <div className="grid gap-4">
        {students.map((student) => (
          <div key={student._id} className="p-4 border rounded shadow-sm bg-white">
            <h2 className="text-lg font-bold">{student.fullName}</h2>
            <p className="text-sm text-gray-600">
              Class: {student.targetClass} - {student.section} | Father: {student.fatherName} ({student.fatherMobile})
            </p>
            <p className="text-xs text-gray-500 mt-1">
              House: {student.house} | Fee Status: <span className="font-semibold">{student.feeStatus}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}