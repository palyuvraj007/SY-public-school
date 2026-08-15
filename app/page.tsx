'use client';

import { useState, useEffect, useRef } from 'react';

// --- DATA STRUCTURES ---
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
  assignedHouse: string;
  feeStatus: 'Paid' | 'Pending';
}

interface Teacher {
  id: number;
  fullName: string;
  subjectExpertise: string;
  mobile: string;
  permAddress: string;
  resAddress: string;
  degrees: string;
  gender: string;
}

interface AttendanceRecord {
  id: number;
  entryTime: string;
  name: string;
  targetClass: string;
  section: string;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface Achievement {
  id: number;
  title: string;
  studentName: string;
}

interface HouseInfo {
  name: string;
  icon: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  headTeacherId: number | null;
}

export default function Home() {
  const [selectedClass, setSelectedClass] = useState<string>("PG");

  const prePrimaryClasses = ["PG", "Nursery", "LKG", "UKG"];
  const prePrimarySections = ["Wonder World","Star World","Magic Kingdom"]; // Update to match your exact PG-UKG section names!
  const StandardSections = ["A", "B", "C"];
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'students' | 'teachers' | 'houses' | 'admin' | 'attendance' | 'notices'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Class Roster / Teacher Detail Popup Modals
  const [selectedSidebarSection, setSelectedSidebarSection] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Hogwarts Houses
  const Houses = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

  const [houseHeads, setHouseHeads] = useState<Record<string, number | null>>({
    Gryffindor: null,
    Slytherin: null,
    Ravenclaw: null,
    Hufflepuff: null,
  });

  // Shared Application State
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [notices, setNotices] = useState<Notice[]>([
    { id: 1, title: 'Annual Sports Day', content: 'Sports day scheduled for next Friday.', date: '2026-08-10' }
  ]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, title: 'Science Olympiad Gold Medal', studentName: 'Rahul Sharma' }
  ]);
  // --- Live Time & Dynamic Greeting ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const greeting =
    hours < 12
      ? "Good Morning"
      : hours < 18
      ? "Good Afternoon"
      : "Good Evening";

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Toast feedback state
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Class Roster Structure
  const classesList = [
    'PG', 'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ];

  const fantasySections = ['Wonder World', 'Star World', 'Magic Kingdom'];
  const standardSections = ['Section A', 'Section B', 'Section C'];

  const getSectionsForClass = (cls: string) => {
    if (['PG', 'Nursery', 'LKG', 'UKG'].includes(cls)) {
      return fantasySections;
    }
    return standardSections;
  };

  const allClassSections = classesList.flatMap((cls) =>
    getSectionsForClass(cls).map((sec) => `${cls} - ${sec}`)
  );

  // DOM Refs to access input elements directly
  const studentFormRef = useRef<HTMLFormElement>(null);
  const teacherFormRef = useRef<HTMLFormElement>(null);
  const attendanceFormRef = useRef<HTMLFormElement>(null);
  const noticeFormRef = useRef<HTMLFormElement>(null);
  const achievementFormRef = useRef<HTMLFormElement>(null);

  // Load from Local Storage on mount
  useEffect(() => {
    try {
      const s = localStorage.getItem('sy_students');
      const t = localStorage.getItem('sy_teachers');
      const a = localStorage.getItem('sy_attendance');
      const n = localStorage.getItem('sy_notices');
      const ach = localStorage.getItem('sy_achievements');
      const hh = localStorage.getItem('sy_house_heads');

      if (s) setStudents(JSON.parse(s));
      if (t) setTeachers(JSON.parse(t));
      if (a) setAttendance(JSON.parse(a));
      if (n) setNotices(JSON.parse(n));
      if (ach) setAchievements(JSON.parse(ach));
      if (hh) setHouseHeads(JSON.parse(hh));
    } catch (e) {
      console.error('Error reading localStorage data', e);
    }
  }, []);

  // Save to Local Storage
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('sy_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('sy_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('sy_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('sy_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('sy_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('sy_house_heads', JSON.stringify(houseHeads));
  }, [houseHeads]);

  // --- HANDLERS ---
  const handleAddStudent = () => {
    if (!studentFormRef.current) return;
    const form = studentFormRef.current;
    
    const fullName = (form.querySelector('[name="fullName"]') as HTMLInputElement)?.value.trim();
    const fatherName = (form.querySelector('[name="fatherName"]') as HTMLInputElement)?.value.trim();
    const fatherMobile = (form.querySelector('[name="fatherMobile"]') as HTMLInputElement)?.value.trim();
    const motherName = (form.querySelector('[name="motherName"]') as HTMLInputElement)?.value.trim();
    const motherMobile = (form.querySelector('[name="motherMobile"]') as HTMLInputElement)?.value.trim();
    const permAddress = (form.querySelector('[name="permAddress"]') as HTMLTextAreaElement)?.value.trim();
    const resAddress = (form.querySelector('[name="resAddress"]') as HTMLTextAreaElement)?.value.trim();
    const targetClass = (form.querySelector('[name="targetClass"]') as HTMLSelectElement)?.value || 'PG';

    if (!fullName || !fatherName || !fatherMobile) {
      alert('Please fill in required fields: Student Name, Father Name, Father Mobile');
      return;
    }

    const available = getSectionsForClass(targetClass);
    const randomSec = available[Math.floor(Math.random() * available.length)];
    const assignedHouse = Houses[Math.floor(Math.random() * Houses.length)];

    const newStudent: Student = {
      id: Date.now(),
      fullName,
      fatherName,
      motherName,
      fatherMobile,
      motherMobile,
      permAddress,
      resAddress,
      targetClass,
      assignedSection: `${targetClass} - ${randomSec}`,
      assignedHouse,
      feeStatus: 'Pending'
    };

    setStudents(prev => [...prev, newStudent]);
    form.reset();
    showToast(`✨ Registered ${fullName} -> Sorted into ${assignedHouse}!`);
  };

  const handleAddTeacher = () => {
    if (!teacherFormRef.current) return;
    const form = teacherFormRef.current;

    const fullName = (form.querySelector('[name="fullName"]') as HTMLInputElement)?.value.trim();
    const subjectExpertise = (form.querySelector('[name="subjectExpertise"]') as HTMLInputElement)?.value.trim();
    const mobile = (form.querySelector('[name="mobile"]') as HTMLInputElement)?.value.trim();
    const degrees = (form.querySelector('[name="degrees"]') as HTMLInputElement)?.value.trim();
    const gender = (form.querySelector('[name="gender"]') as HTMLSelectElement)?.value || 'Male';
    const permAddress = (form.querySelector('[name="permAddress"]') as HTMLTextAreaElement)?.value.trim();
    const resAddress = (form.querySelector('[name="resAddress"]') as HTMLTextAreaElement)?.value.trim();

    if (!fullName || !subjectExpertise || !mobile) {
      alert('Please fill in required fields: Full Name, Subject Expertise, Mobile');
      return;
    }

    const newTeacher: Teacher = {
      id: Date.now(),
      fullName,
      subjectExpertise,
      mobile,
      permAddress,
      resAddress,
      degrees,
      gender
    };

    setTeachers(prev => [...prev, newTeacher]);
    form.reset();
    showToast(`✨ Registered Teacher: ${fullName}`);
  };

  const handleAssignHouseHead = (houseName: string, teacherIdStr: string) => {
    const teacherId = teacherIdStr === 'none' ? null : Number(teacherIdStr);
    setHouseHeads(prev => ({ ...prev, [houseName]: teacherId }));
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      showToast(`🏰 ${teacher.fullName} is now Head of ${houseName}!`);
    } else {
      showToast(`Cleared Head of House for ${houseName}`);
    }
  };

  const handleAddAttendance = () => {
    if (!attendanceFormRef.current) return;
    const form = attendanceFormRef.current;

    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value.trim();
    const targetClass = (form.querySelector('[name="targetClass"]') as HTMLSelectElement)?.value;
    const section = (form.querySelector('[name="section"]') as HTMLSelectElement)?.value;
    const entryTime = (form.querySelector('[name="entryTime"]') as HTMLInputElement)?.value.trim();

    if (!name) {
      alert('Please enter student name for attendance.');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      name,
      targetClass,
      section,
      entryTime: entryTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAttendance(prev => [newRecord, ...prev]);
    form.reset();
    showToast(`✨ Attendance recorded for ${name}`);
  };

  const handleAddNotice = () => {
    if (!noticeFormRef.current) return;
    const form = noticeFormRef.current;

    const title = (form.querySelector('[name="title"]') as HTMLInputElement)?.value.trim();
    const content = (form.querySelector('[name="content"]') as HTMLTextAreaElement)?.value.trim();

    if (!title || !content) return;

    setNotices(prev => [{ id: Date.now(), title, content, date: new Date().toISOString().split('T')[0] }, ...prev]);
    form.reset();
  };

  const handleAddAchievement = () => {
    if (!achievementFormRef.current) return;
    const form = achievementFormRef.current;

    const title = (form.querySelector('[name="title"]') as HTMLInputElement)?.value.trim();
    const studentName = (form.querySelector('[name="studentName"]') as HTMLInputElement)?.value.trim();

    if (!title || !studentName) return;

    setAchievements(prev => [{ id: Date.now(), title, studentName }, ...prev]);
    form.reset();
  };

  const toggleFeeStatus = (id: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, feeStatus: s.feeStatus === 'Paid' ? 'Pending' : 'Paid' } : s));
  };

  const sidebarSectionStudents = selectedSidebarSection 
    ? students.filter(s => s.assignedSection === selectedSidebarSection)
    : [];

  const houseData = [
    { name: 'Gryffindor', icon: '🦁', bg: 'bg-red-50 border-red-200', text: 'text-red-900', badge: 'bg-red-800 text-red-100' },
    { name: 'Slytherin', icon: '🐍', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-800 text-emerald-100' },
    { name: 'Ravenclaw', icon: '🦅', bg: 'bg-sky-50 border-sky-200', text: 'text-sky-900', badge: 'bg-sky-800 text-sky-100' },
    { name: 'Hufflepuff', icon: '🦡', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-900', badge: 'bg-amber-800 text-amber-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative">

      {/* TOAST NOTIFICATION */}
      {feedbackMsg && (
        <div className="fixed top-20 right-6 z-50 bg-amber-900 text-amber-100 font-black px-5 py-3 rounded-2xl shadow-xl transition-all border border-amber-500/30">
          {feedbackMsg}
        </div>
      )}

      {/* HEADER WITH HOGWARTS STYLE LOGO */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 font-bold transition-colors flex items-center gap-2 border border-slate-300 cursor-pointer"
          >
            <span>☰</span> <span className="text-xs font-black uppercase tracking-wider">Navigation Menu</span>
          </button>
          
          {/* HOGWARTS BRANDING */}
          <div className="flex items-center gap-2">
            <span className="text-3xl filter drop-shadow-md">🏰</span>
            <h1 className="text-2xl font-black text-amber-900 tracking-tight font-serif">
              SY Public School
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex gap-2">
          {['home', 'students', 'teachers', 'houses', 'admin', 'attendance', 'notices'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-900 text-amber-100 shadow-md'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* SIDEBAR DRAWER WITH CLASSES & TEACHERS DIRECTORY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

          <div className="relative w-80 bg-white border-r border-slate-200 p-6 flex flex-col h-full z-10 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900 font-serif">🏰 SY Directory</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-red-600 font-black text-xl cursor-pointer">✕</button>
            </div>

            {/* TEACHERS DIRECTORY IN SIDEBAR */}
            <div className="py-4 border-b border-slate-200 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 flex justify-between items-center">
                <span>👩‍🏫 Faculty Members</span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px]">{teachers.length}</span>
              </h3>

              {teachers.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No teachers registered yet.</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {teachers.map(t => {
                    // Check if this teacher is a Head of House
                    const ledHouse = Object.entries(houseHeads).find(([_, id]) => id === t.id)?.[0];
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTeacher(t);
                          setIsSidebarOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 border border-transparent hover:border-amber-200 transition-all flex justify-between items-center cursor-pointer"
                      >
                        <div>
                          <p className="font-extrabold">{t.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{t.subjectExpertise}</p>
                        </div>
                        {ledHouse && (
                          <span className="text-[9px] font-black bg-amber-900 text-amber-100 px-2 py-0.5 rounded-full">
                            Head: {ledHouse}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CLASSES MENU IN SIDEBAR */}
            <div className="py-4 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                🏫 Classes & Roster
              </h3>
              <div className="space-y-1">
                {allClassSections.map((sec) => {
                  const count = students.filter(s => s.assignedSection === sec).length;
                  return (
                    <button
                      key={sec}
                      onClick={() => {
                        setSelectedSidebarSection(sec);
                        setIsSidebarOpen(false);
                      }}
                      className="w-full text-left flex justify-between items-center px-3 py-2 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 border border-transparent transition-all cursor-pointer"
                    >
                      <span>🏰 {sec}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-black">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER DETAIL POPUP MODAL */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 w-full max-w-md p-6 rounded-2xl shadow-2xl relative text-slate-800">
            <button onClick={() => setSelectedTeacher(null)} className="absolute top-4 right-4 text-2xl font-black text-slate-400 hover:text-red-600 cursor-pointer">✕</button>

            <div className="flex items-center gap-3 border-b pb-3 mb-4">
              <span className="text-3xl">👩‍🏫</span>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-serif">{selectedTeacher.fullName}</h2>
                <p className="text-xs font-bold text-amber-900">{selectedTeacher.subjectExpertise}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-medium text-slate-700 mb-6">
              <p><strong className="text-slate-900">Degrees:</strong> {selectedTeacher.degrees || 'N/A'}</p>
              <p><strong className="text-slate-900">Mobile:</strong> {selectedTeacher.mobile}</p>
              <p><strong className="text-slate-900">Gender:</strong> {selectedTeacher.gender}</p>
              <p><strong className="text-slate-900">Permanent Address:</strong> {selectedTeacher.permAddress || 'N/A'}</p>
              <p><strong className="text-slate-900">Residential Address:</strong> {selectedTeacher.resAddress || 'N/A'}</p>
            </div>

            <button onClick={() => setSelectedTeacher(null)} className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-sm cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      {/* CLASS ROSTER POPUP MODAL */}
      {selectedSidebarSection && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative text-slate-800">
            <button onClick={() => setSelectedSidebarSection(null)} className="absolute top-4 right-4 text-2xl font-black text-slate-400 hover:text-red-600 cursor-pointer">✕</button>

            <h2 className="text-xl font-black border-b pb-3 mb-2 text-slate-900 font-serif">
              Students in <span className="text-amber-900">{selectedSidebarSection}</span>
            </h2>

            {sidebarSectionStudents.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 my-4">
                <p className="text-slate-500 font-semibold text-sm">No student registered in this section yet.</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 my-4 pr-1">
                {sidebarSectionStudents.map((s, idx) => (
                  <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{idx + 1}. {s.fullName}</p>
                      <p className="text-xs text-slate-500 font-medium">House: <strong className="text-amber-900">{s.assignedHouse}</strong> | Father: {s.fatherName}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {s.feeStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setSelectedSidebarSection(null)} className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-sm cursor-pointer">
              Close Roster
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl w-full mx-auto p-6 flex-1">

        {/* HOME DASHBOARD WITH HOGWARTS BANNER */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* --- ULTRA-MODERN DYNAMIC HERO BANNER --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-8 md:p-12 shadow-2xl border border-slate-800 mb-8">
          {/* Ambient Background Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Column: Greeting & Headline */}
            <div className="max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-amber-300 border border-white/15 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {greeting}, Admin
                </span>

                <span className="text-xs font-medium text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                  📅 {formattedDate}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-200">
                Welcome to SY Public School
              </h1>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-normal">
                Streamlined school administration portal for real-time tracking of students, faculty, attendance, houses, and school records.
              </p>
            </div>

            {/* Right Column: System Status Badge */}
            <div className="flex-shrink-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 md:w-64 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>System Status</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 w-[100%] rounded-full" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                All administrative services operational for Academic Session 2026.
              </p>
            </div>
          </div>
        </div>

            {/* --- STEP 3: SLEEK STAT CARDS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {/* Card 1: Students */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400/60 transition-all duration-300">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase group-hover:text-amber-800 transition-colors">
              TOTAL STUDENTS
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-4xl font-extrabold text-slate-900">
                {students.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">Enrolled</span>
            </div>
          </div>

          {/* Card 2: Teachers */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400/60 transition-all duration-300">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase group-hover:text-amber-800 transition-colors">
              TOTAL TEACHERS
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-4xl font-extrabold text-slate-900">
                {teachers.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">Faculty</span>
            </div>
          </div>

          {/* Card 3: School Houses */}
          <div 
            onClick={() => setActiveTab('houses')}
            className="group bg-gradient-to-br from-amber-50/50 to-white p-6 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md hover:border-amber-500 transition-all duration-300 cursor-pointer"
          >
            <span className="text-xs font-bold text-amber-800 tracking-wider uppercase">
              SCHOOL HOUSES
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-4xl font-extrabold text-amber-950">
                {Houses.length}
              </span>
              <span className="text-xs font-semibold text-amber-700 underline group-hover:text-amber-900">
                Manage →
              </span>
            </div>
          </div>

          {/* Card 4: Active Classes */}
          <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400/60 transition-all duration-300">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase group-hover:text-amber-800 transition-colors">
              ACTIVE CLASSES
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-4xl font-extrabold text-slate-900">
                {classesList.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">Sections</span>
            </div>
          </div>
        </div>
          </div>
        )}
                {/* --- STEP 4: SCHOOL ACHIEVEMENTS SECTION (Home-only) --- */}
        {activeTab === 'home' && (
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl font-bold text-lg">
                  🏆
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    School Achievements & Honors
                  </h3>
                  <p className="text-xs text-slate-500">
                    Celebrating excellence across academics, sports, and extra-curriculars.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements && achievements.length > 0 ? (
                achievements.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all space-y-2 group"
                  >
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Award Winner
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </h4>
                    {item.studentName && (
                      <p className="text-xs text-slate-600 font-medium">
                        Awarded to: <span className="text-slate-900">{item.studentName}</span>
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No achievements posted yet.
                </div>
              )}
            </div>
          </section>
        )}
        {/* HOUSES & LEADERS SECTION */}
        {activeTab === 'houses' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 border-b pb-3 font-serif">🏰 Houses & House Leadership</h2>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Manage house leadership and view assigned students for Gryffindor, Slytherin, Ravenclaw, and Hufflepuff.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {houseData.map(house => {
                const headTeacherId = houseHeads[house.name];
                const headTeacher = teachers.find(t => t.id === headTeacherId);
                const houseStudents = students.filter(s => s.assignedHouse === house.name);

                return (
                  <div key={house.name} className={`p-6 rounded-3xl border-2 ${house.bg} shadow-xs space-y-4`}>
                    <div className="flex justify-between items-center border-b pb-3 border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl filter drop-shadow-xs">{house.icon}</span>
                        <div>
                          <h3 className={`text-2xl font-black font-serif ${house.text}`}>{house.name}</h3>
                          <p className="text-xs font-bold text-slate-500">{houseStudents.length} Students Assigned</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${house.badge}`}>
                        House
                      </span>
                    </div>

                    {/* HOUSE HEAD ASSIGNMENT (CONTROLLED BY YOU) */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                      <label className="block text-xs font-extrabold uppercase text-slate-700">
                        👑 Head of House (Assign Leader):
                      </label>
                      <select 
                        value={headTeacherId || 'none'}
                        onChange={(e) => handleAssignHouseHead(house.name, e.target.value)}
                        className="w-full border-2 border-slate-200 p-2 rounded-xl text-xs font-extrabold text-slate-800 bg-slate-50 focus:border-amber-700 focus:outline-hidden"
                      >
                        <option value="none">-- Select Teacher to Lead {house.name} --</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.fullName} ({t.subjectExpertise})
                          </option>
                        ))}
                      </select>

                      {headTeacher ? (
                        <p className="text-xs text-emerald-800 font-extrabold pt-1">
                          Current Leader: <span className="underline">{headTeacher.fullName}</span> ({headTeacher.subjectExpertise})
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic pt-1">No teacher assigned as Head of House yet.</p>
                      )}
                    </div>

                    {/* HOUSE STUDENTS ROSTER */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black uppercase text-slate-500 mb-2">Sorted Students</h4>
                      {houseStudents.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No students sorted into {house.name} yet.</p>
                      ) : (
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                          {houseStudents.map(s => (
                            <div key={s.id} className="text-xs p-2 bg-slate-50 rounded-lg font-bold text-slate-800 flex justify-between">
                              <span>{s.fullName}</span>
                              <span className="text-slate-400 font-normal">{s.targetClass}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STUDENT REGISTRATION PAGE */}
{activeTab === 'students' && (
  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
    <div className="flex justify-between items-center border-b pb-4 mb-6">
      <h2 className="text-2xl font-black text-slate-900 font-serif">🎓 Student Registration</h2>
      <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">{students.length} Added</span>
    </div>

    <form ref={studentFormRef} onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div>
        <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Student Full Name *</label>
        <input name="fullName" type="text" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Father's Name *</label>
          <input name="fatherName" type="text" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Father's Mobile Number *</label>
          <input name="fatherMobile" type="tel" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Mother's Name</label>
          <input name="motherName" type="text" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Mother's Mobile Number</label>
          <input name="motherMobile" type="tel" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Permanent Address</label>
          <textarea name="permAddress" rows={2} className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Residential Address</label>
          <textarea name="resAddress" rows={2} className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
        </div>
      </div>

      {/* Class and Dynamic Section in a 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Class *</label>
          <select 
            name="targetClass" 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden"
          >
            {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Section *</label>
          <select 
            name="targetSection" 
            className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden"
          >
            {prePrimaryClasses.includes(selectedClass)
              ? prePrimarySections.map(sec => <option key={sec} value={sec}>{sec}</option>)
              : standardSections.map(sec => <option key={sec} value={sec}>Section {sec}</option>)
            }
          </select>
        </div>
      </div>
      <button 
        type="button" 
        onClick={handleAddStudent} 
        className="w-full bg-amber-900 text-amber-100 font-black py-3 rounded-xl hover:bg-amber-950 active:scale-[0.99] transition-all shadow-md cursor-pointer"
      >
        + Save & Sort Student 
      </button>
    </form>
  </div>
)}

        {/* TEACHER FORM */}
        {activeTab === 'teachers' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-black text-slate-900 font-serif">👩‍🏫 Teacher Registration</h2>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">{teachers.length} Added</span>
            </div>

            <form ref={teacherFormRef} onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Full Name *</label>
                <input name="fullName" type="text" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Subject Expertise *</label>
                  <input name="subjectExpertise" type="text" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Mobile Number *</label>
                  <input name="mobile" type="tel" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Degrees</label>
                  <input name="degrees" type="text" placeholder="e.g. B.Ed, M.Sc Physics" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Gender</label>
                  <select name="gender" defaultValue="Male" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Permanent Address</label>
                  <textarea name="permAddress" rows={2} className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Residential Address</label>
                  <textarea name="resAddress" rows={2} className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleAddTeacher} 
                className="w-full bg-amber-900 text-amber-100 font-black py-3 rounded-xl hover:bg-amber-950 active:scale-[0.99] transition-all shadow-md cursor-pointer"
              >
                + Save & Add Another Teacher
              </button>
            </form>
          </div>
        )}

        {/* ADMIN OFFICE */}
        {activeTab === 'admin' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900 border-b pb-4 font-serif">💼 Admin Office - Fee Records</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allClassSections.map((sec) => {
                const secStudents = students.filter(s => s.assignedSection === sec);
                return (
                  <div key={sec} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h3 className="font-extrabold text-slate-900 text-base">{sec}</h3>
                    <p className="text-xs text-slate-500 font-bold mb-3">{secStudents.length} Students</p>

                    {secStudents.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No registered students</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {secStudents.map(s => (
                          <div key={s.id} className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-slate-200">
                            <div>
                              <p className="font-bold text-slate-800">{s.fullName}</p>
                              <p className="text-[10px] text-amber-900 font-black">{s.assignedHouse}</p>
                            </div>
                            <button
                              onClick={() => toggleFeeStatus(s.id)}
                              className={`px-2 py-0.5 rounded-full font-black text-[10px] cursor-pointer ${s.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}
                            >
                              {s.feeStatus}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-slate-900 border-b pb-4 mb-6 font-serif">🕒 Mark Entry Attendance</h2>
              <form ref={attendanceFormRef} onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Student Full Name *</label>
                  <input name="name" type="text" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Class</label>
                    <select name="targetClass" defaultValue="Class 1" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden">
                      {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Section</label>
                    <select name="section" defaultValue="Section A" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden">
                      {standardSections.concat(fantasySections).map(sec => <option key={sec} value={sec}>{sec}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-600 mb-1">Time of Entering</label>
                    <input name="entryTime" defaultValue={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} type="text" className="w-full border-2 border-slate-200 p-2.5 rounded-xl font-bold text-slate-900 bg-white focus:border-amber-700 focus:outline-hidden" />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleAddAttendance} 
                  className="w-full bg-amber-900 text-amber-100 font-black py-3 rounded-xl hover:bg-amber-950 active:scale-[0.99] transition-all shadow-md cursor-pointer"
                >
                  + Record Entry
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
              <h3 className="text-xl font-black text-slate-900 border-b pb-3 mb-4 font-serif">📋 Attendance Log</h3>
              <div className="space-y-2">
                {attendance.length === 0 ? (
                  <p className="text-slate-400 italic text-sm text-center py-4">No attendance records today.</p>
                ) : (
                  attendance.map(a => (
                    <div key={a.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold">
                      <div>
                        <span className="text-slate-900">{a.name}</span>
                        <span className="text-xs text-amber-800 font-extrabold ml-3">({a.targetClass} - {a.section})</span>
                      </div>
                      <span className="text-slate-500 font-mono text-xs">{a.entryTime}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
       {/* --- NOTICES ONLY SECTION --- */}
        {activeTab === 'notices' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-900 border-b pb-3 font-serif">
              📌 Editable Notices
            </h2>

            <form 
              ref={noticeFormRef} 
              onSubmit={(e) => e.preventDefault()} 
              className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200"
            >
              <input 
                name="title" 
                type="text" 
                placeholder="Notice Title" 
                className="w-full border-2 border-slate-200 p-2.5 rounded-xl bg-white text-sm"
              />
              <textarea 
                name="content" 
                placeholder="Notice Content" 
                rows={3} 
                className="w-full border-2 border-slate-200 p-2.5 rounded-xl bg-white text-sm"
              />
              <button 
                type="button" 
                onClick={handleAddNotice} 
                className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-sm"
              >
                Post Notice
              </button>
            </form>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Notices
              </h3>
              {notices.map((n) => (
                <div key={n.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-slate-900 text-sm">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {n.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}