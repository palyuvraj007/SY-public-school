'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [feeRecords, setFeeRecords] = useState<Array<{ id: number; name: string; rollNo: string; amount: string; status: string }>>([]);

  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Paid');

  const handleAddFeeRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !rollNo) return;

    setFeeRecords([
      ...feeRecords,
      { id: Date.now(), name: studentName, rollNo, amount: `$${amount || '0'}`, status }
    ]);

    setStudentName('');
    setRollNo('');
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-8">
      <Link href="/" className="text-blue-700 font-bold mb-6 inline-block hover:underline">&larr; Back to Home</Link>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-300">
        <h1 className="text-3xl font-black text-slate-900 border-b pb-4 mb-6">⚙️ Admin Portal</h1>

        {/* Form to Add Fee Records */}
        <form onSubmit={handleAddFeeRecord} className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 mb-8 space-y-3">
          <h3 className="font-bold text-slate-900 text-lg">➕ Add Fee Payment Record</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input 
              type="text" 
              placeholder="Student Name" 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="border-2 border-slate-300 p-2 rounded-lg text-slate-900 font-bold bg-white"
              required
            />
            <input 
              type="text" 
              placeholder="Roll No" 
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="border-2 border-slate-300 p-2 rounded-lg text-slate-900 font-bold bg-white"
              required
            />
            <input 
              type="number" 
              placeholder="Amount ($)" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-2 border-slate-300 p-2 rounded-lg text-slate-900 font-bold bg-white"
              required
            />
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="border-2 border-slate-300 p-2 rounded-lg text-slate-900 font-bold bg-white"
            >
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800">
            Add Record
          </button>
        </form>

        {/* Fee Table */}
        <h3 className="text-xl font-bold text-slate-900 mb-3">Fee Status List</h3>
        {feeRecords.length === 0 ? (
          <p className="text-slate-500 italic">No fee records added yet.</p>
        ) : (
          <table className="w-full border-collapse border-2 border-slate-300 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-200 text-slate-900 text-left">
                <th className="border p-3 font-extrabold">Roll No</th>
                <th className="border p-3 font-extrabold">Student Name</th>
                <th className="border p-3 font-extrabold">Amount</th>
                <th className="border p-3 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="border p-3 font-mono font-bold text-slate-900">{f.rollNo}</td>
                  {/* CLEAR VISIBLE NAME */}
                  <td className="border p-3 font-black text-slate-900 text-lg">{f.name}</td>
                  <td className="border p-3 font-bold text-slate-800">{f.amount}</td>
                  <td className="border p-3 font-bold">
                    <span className={`px-2 py-1 rounded text-xs ${f.status === 'Paid' ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'}`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}