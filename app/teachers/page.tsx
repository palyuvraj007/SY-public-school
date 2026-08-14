'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Teacher {
  id: number;
  fullName: string;
  phone: string;
  permAddress: string;
  resAddress: string;
  expertiseSubject: string;
  preferredClass: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    permAddress: '',
    resAddress: '',
    expertiseSubject: '',
    preferredClass: 'Class 1'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTeacher: Teacher = {
      id: Date.now(),
      ...formData
    };

    setTeachers([...teachers, newTeacher]);

    setFormData({
      fullName: '',
      phone: '',
      permAddress: '',
      resAddress: '',
      expertiseSubject: '',
      preferredClass: 'Class 1'
    });

    alert("Teacher registered successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-8">
      <Link href="/" className="text-blue-700 font-bold mb-6 inline-block hover:underline">&larr; Back to Home</Link>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* TEACHER FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-300">
          <h1 className="text-3xl font-black text-slate-900 border-b pb-4 mb-6">👩‍🏫 Teacher Registration</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold">Teacher Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" placeholder="Prof. Sarah Connor" />
              </div>
              <div>
                <label className="block text-sm font-bold">Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" placeholder="+91 9876543210" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold">Expertise Subject *</label>
                <input type="text" name="expertiseSubject" required value={formData.expertiseSubject} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" placeholder="Mathematics / English / Science" />
              </div>
              <div>
                <label className="block text-sm font-bold">Which Class Would You Like to Teach? *</label>
                <select name="preferredClass" value={formData.preferredClass} onChange={handleChange} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold">
                  <option value="Playgroup (PG)">Playgroup (PG)</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-bold">Permanent Address *</label>
                <textarea name="permAddress" required value={formData.permAddress} onChange={handleChange} rows={2} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold">Residential Address *</label>
                <textarea name="resAddress" required value={formData.resAddress} onChange={handleChange} rows={2} className="w-full border-2 border-slate-300 p-2.5 rounded-lg font-bold" />
              </div>
            </div>

            <button type="submit" className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-extrabold hover:bg-emerald-800 w-full mt-4">
              💾 Register Teacher
            </button>
          </form>
        </div>

        {/* REGISTERED TEACHERS ROSTER */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-300">
          <h2 className="text-2xl font-black text-slate-900 border-b pb-4 mb-6">👩‍🏫 Registered Faculty List</h2>

          {teachers.length === 0 ? (
            <p className="text-slate-500 italic">No teachers registered yet.</p>
          ) : (
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-lg text-slate-900">{teacher.fullName}</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Phone: {teacher.phone}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">Subject Expertise: <span className="text-blue-700">{teacher.expertiseSubject}</span> | Prefers: <span className="text-blue-700">{teacher.preferredClass}</span></p>
                  <p className="text-xs text-slate-600">🏠 <strong>Res. Address:</strong> {teacher.resAddress} | <strong>Perm. Address:</strong> {teacher.permAddress}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}