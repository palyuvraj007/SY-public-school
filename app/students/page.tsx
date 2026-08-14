'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Student {
  id: number;
  fullName: string;
  fatherName: string;
  motherName: string;
  fatherMobile: string;
  motherMobile: string;
  permAddress: string;
  resAddress: string;
  targetClass: string;
  assignedSection: string;
}

function StudentPortalContent() {
  const searchParams = useSearchParams();
  const classFromUrl = searchParams.get('class');

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeClassFilter, setActiveClassFilter] = useState<string>('All');
  const [isLoaded, setIsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    fatherMobile: '',
    motherMobile: '',
    permAddress: '',
    resAddress: '',
    targetClass: 'Class 1'
  });

  const availableClasses = [
    'Playgroup (PG)', 'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ];

  const prePrimarySections: Record<string, string[]> = {
    'Playgroup (PG)': ['Wonder World', 'Star World', 'Magic Kingdom'],
    'Nursery': ['Rainbow Kingdom', 'Sunshine Valley', 'Dreamland'],
    'LKG': ['Magic Garden', 'Sunflowers', 'Butterflies'],
    'UKG': ['Galaxy World', 'Starlight', 'Little Champs']
  };

  const standardSections = ['Section A', 'Section B', 'Section C'];

  // Load saved students
  useEffect(() => {
    const savedStudents = localStorage.getItem('school_students_data');
    if (savedStudents) {
      try {
        setStudents(JSON.parse(savedStudents));
      } catch (err) {
        console.error('Failed to parse saved students:', err);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync class filter if passed from sidebar URL
  useEffect(() => {
    if (classFromUrl) {
      // Handle inputs like "Class 2 - Section B" or "Class 2"
      const baseClass = classFromUrl.split(' - ')[0];
      setActiveClassFilter(baseClass);
    }
  }, [classFromUrl]);

  // Save to local storage on update
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('school_students_data', JSON.stringify(students));
    }
  }, [students, isLoaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let availableSections = standardSections;
    if (prePrimarySections[formData.targetClass]) {
      availableSections = prePrimarySections[formData.targetClass];
    }

    const randomSection = availableSections[Math.floor(Math.random() * availableSections.length)];

    const newStudent: Student = {
      id: Date.now(),
      ...formData,
      assignedSection: `${formData.targetClass} - ${randomSection}`
    };

    setStudents([...students, newStudent]);
    setActiveClassFilter(formData.targetClass);

    setFormData({
      fullName: '',
      fatherName: '',
      motherName: '',
      fatherMobile: '',
      motherMobile: '',
      permAddress: '',
      resAddress: '',
      targetClass: 'Class 1'
    });

    alert(`Student registered successfully!`);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all saved student data?')) {
      setStudents([]);
      localStorage.removeItem('school_students_data');
    }
  };

  // Filter matching students (by full class or main class name)
  const filteredStudents = activeClassFilter === 'All' 
    ? students 
    : students.filter((s) => 
        s.targetClass === activeClassFilter || 
        s.assignedSection.toLowerCase().includes(activeClassFilter.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-8">
      <Link href="/" className="text-blue-700 font-bold mb-6 inline-block hover:underline">&larr; Back to Home</Link>
      
      <div className="max-w-6xl mx-auto space-y-8">
        {/* FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-300">
          <h1 className="text-3xl font-black text-slate-900 border-b pb-4 mb-6">🎓 Student Registration</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Student Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" placeholder="Alex Smith" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Class to Join *</label>
                <select name="targetClass" value={formData.targetClass} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold">
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-bold mb-1">Father's Name *</label>
                <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Father's Mobile Number *</label>
                <input type="tel" name="fatherMobile" required value={formData.fatherMobile} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Mother's Name *</label>
                <input type="text" name="motherName" required value={formData.motherName} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Mother's Mobile Number *</label>
                <input type="tel" name="motherMobile" required value={formData.motherMobile} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-bold mb-1">Permanent Address *</label>
                <textarea name="permAddress" required value={formData.permAddress} onChange={handleChange} rows={2} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Residential Address *</label>
                <textarea name="resAddress" required value={formData.resAddress} onChange={handleChange} rows={2} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
            </div>

            <button type="submit" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-extrabold hover:bg-blue-800 w-full mt-4 text-lg shadow-md transition-all">
              Submit
            </button>
          </form>
        </div>

        {/* CLASS SELECTOR ROSTER */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-300">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-2xl font-black text-slate-900">📚 View Registered Students by Class</h2>
            {students.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
              >
                Clear All Saved Data
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveClassFilter('All')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                activeClassFilter === 'All'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              All Classes ({students.length})
            </button>

            {availableClasses.map((cls) => {
              const count = students.filter((s) => s.targetClass === cls).length;
              return (
                <button
                  key={cls}
                  onClick={() => setActiveClassFilter(cls)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    activeClassFilter === cls
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <span>{cls}</span>
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeClassFilter === cls ? 'bg-white text-blue-700' : 'bg-blue-700 text-white'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-black text-slate-800 mb-4">
              Showing Students for: <span className="text-blue-700">{activeClassFilter}</span>
            </h3>

            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                <p className="text-slate-500 font-medium italic">No students registered in {activeClassFilter} yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-4 bg-slate-50 border-2 border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition-all">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">{student.fullName}</h4>
                      <p className="text-xs font-bold text-blue-700 uppercase mt-0.5">Section: {student.assignedSection}</p>
                      <p className="text-xs text-slate-500 mt-1">Father: {student.fatherName}</p>
                    </div>

                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-2 hover:bg-slate-200 rounded-full text-2xl font-black leading-none text-slate-700 transition-colors"
                      title="View Full Details"
                    >
                      ⋮
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* THREE DOTS POPUP */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative border-2 border-slate-300">
            <button 
              onClick={() => setSelectedStudent(null)} 
              className="absolute top-4 right-4 text-2xl font-black text-slate-400 hover:text-red-600 transition-colors"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-slate-900 border-b pb-3 mb-4">📋 Complete Student Profile</h2>

            <div className="space-y-3 font-semibold text-slate-800 text-sm">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p><strong>Student Full Name:</strong> {selectedStudent.fullName}</p>
                <p><strong>Class & Section:</strong> <span className="text-blue-700 font-bold">{selectedStudent.assignedSection}</span></p>
              </div>
              <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
              <p><strong>Father's Mobile:</strong> {selectedStudent.fatherMobile}</p>
              <p><strong>Mother's Name:</strong> {selectedStudent.motherName}</p>
              <p><strong>Mother's Mobile:</strong> {selectedStudent.motherMobile}</p>
              <p><strong>Permanent Address:</strong> {selectedStudent.permAddress}</p>
              <p><strong>Residential Address:</strong> {selectedStudent.resAddress}</p>
            </div>

            <button 
              onClick={() => setSelectedStudent(null)}
              className="mt-6 w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading Students Portal...</div>}>
      <StudentPortalContent />
    </Suspense>
  );
}