import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Archive, Zap, ShieldCheck, Monitor, TrendingUp,
    Search, X, Eye, EyeOff, Download, LayoutGrid, Trash2, Edit, Plus,
    FolderOpen, Info, LogIn, Filter, ChevronLeft, ChevronRight,
    FileText, Calendar, User, Lock, Book, Bell, Menu, LogOut,
    UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet, FileIcon, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. DATA INITIAL (MOCKS)
// ==========================================

export const INITIAL_USERS = [
    { id: 'AG001', nip: '2982019', nama: 'Program Studi Agribisnis Peternakan', email: 'moderator@halloabdi.com', password: 'ultimate123', role: 'Ultimate', jabatan: 'Program Studi', bio: 'Moderator Nih Bosque', matkul: '', foto: 'https://ui-avatars.com/api/?name=Prodi+Agribisnis&background=b58500&color=fff', status: 'Aktif', tahunAjaran: '2025/2026' },
    { id: 'AG002', nip: '1987654321001', nama: 'Dr. Andi Pratama, S.Pt., M.P.', email: 'andi@polbangtanmalang.ac.id', password: 'superadmin123', role: 'Super Admin', jabatan: 'Ketua Program Studi', bio: 'Sudah Anak', matkul: 'Nutrisi Ternak, Manajemen Peternakan', foto: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0f172a&color=fff', status: 'Aktif', tahunAjaran: '2025/2026' },
    { id: 'AG003', nip: '1987654321002', nama: 'Siti Rahmawati, S.Pt., M.Si.', email: 'siti@polbangtanmalang.ac.id', password: 'admin123', role: 'Admin', jabatan: 'Sekretaris', bio: 'S2', matkul: 'Manajemen Peternakan, Nutrisi Pakan', foto: 'https://ui-avatars.com/api/?name=Siti+Rahmawati&background=10b981&color=fff', status: 'Aktif', tahunAjaran: '2025/2026' },
    { id: 'AG004', nip: '1987654321003', nama: 'Budi Santoso, S.Pt.', email: 'budi@polbangtanmalang.ac.id', password: 'admin123', role: 'Admin', jabatan: 'Dosen', bio: 'S1', matkul: 'Produksi Ternak', foto: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=3b82f6&color=fff', status: 'Aktif', tahunAjaran: '2024/2025' },
    { id: 'AG005', nip: '1987654321004', nama: 'Ir. Soeraso, MP', email: 'soeraso@polbangtanmalang.ac.id', password: 'admin123', role: 'Admin', jabatan: 'Dosen', bio: 'SMA', matkul: 'Produksi Ternak, Manajemen', foto: 'https://ui-avatars.com/api/?name=Ir+Soeraso&background=ef4444&color=fff', status: 'Pensiun', tahunAjaran: '2023/2024' }
];

// Mapping Struktur berdasarkan File Word IAPS 1.0 LAM PTIP
const IAPS_STRUCTURE = [
    {
        kode: "A_BUDAYA_MUTU", label: "A. Budaya Mutu (SPMI)",
        sub: [
            { kode: "A1_Tata_Kelola_SPMI", label: "A1. Tata Kelola SPMI", indikator: ["Ind. 1 - Tersedianya organ dan tupoksi penjaminan mutu", "Ind. 1 - Kebijakan SPMI yang diacu UPPS", "Ind. 1 - Pedoman penerapan siklus PPEPP", "Ind. 1 - Standar mutu penyelenggaraan pendidikan", "Ind. 1 - Tata cara pendokumentasian SPMI", "Ind. 1 - Bukti implementasi SPMI"] },
            { kode: "A2_Pelaksanaan_PPEPP", label: "A2. Pelaksanaan PPEPP", indikator: ["Ind. 2 - Siklus PPEPP bidang akademik", "Ind. 2 - Siklus PPEPP bidang non-akademik", "Ind. 2 - Implementasi PPEPP semua bidang (Laporan Monev)"] },
            { kode: "A3_Efektivitas_Penjaminan_Mutu", label: "A3. Efektivitas Penjaminan Mutu", indikator: ["Ind. 3 - Rapat tinjauan manajemen rutin", "Ind. 3 - External benchmarking", "Ind. 3 - Perbaikan berkelanjutan sistematis"] },
            { kode: "A4_Kepuasan_Stakeholder", label: "A4. Kepuasan Stakeholder", indikator: ["Ind. 4 - Instrumen kepuasan sahih", "Ind. 4 - Database survei 3 tahun", "Ind. 4 - Laporan analisis kepuasan", "Ind. 4 - Tindak lanjut publikasi kepuasan"] }
        ]
    },
    {
        kode: "B_RELEVANSI_PENDIDIKAN", label: "B. Relevansi Pendidikan",
        sub: [
            { kode: "B1_Kurikulum_Materi", label: "B1. Kurikulum Materi", indikator: ["Ind. 5 - Keterlibatan pemangku kepentingan OBE", "Ind. 5 - Kesesuaian CPL dgn KKNI/SKKNI", "Ind. 5 - Ketepatan struktur kurikulum", "Ind. 5 - Kurikulum mencakup SDGs", "Ind. 6 - Kedalaman & keluasan materi"] },
            { kode: "B2_Sumber_Daya_Manusia", label: "B2. Sumber Daya Manusia", indikator: ["Ind. 7 - Renstra pengembangan dosen", "Ind. 8A - NDTPS >= 12", "Ind. 8B - PDTT <= 10%", "Ind. 8C - Dosen Industri/Praktisi >= 20%", "Ind. 7B - Tenaga kependidikan proporsional"] },
            { kode: "B3_Sarana_Prasarana", label: "B3. Sarana Prasarana", indikator: ["Ind. 9 - Sapras mengakomodasi 4 aspek (Mhs, Dosen, Difabel, K3)", "Ind. 10 - Laboratorium memenuhi 5 kriteria", "Ind. 10 - Modul praktikum seluruh lab"] },
            { kode: "B4_Proses_Pembelajaran", label: "B4. Proses Pembelajaran", indikator: ["Ind. 11A - RPS mencakup 5 komponen", "Ind. 12A - Pembelajaran online & offline", "Ind. 12B - Kegiatan ilmiah bulanan", "Ind. 13 - Rubrik Penilaian & 8 Prinsip", "Ind. 14 - Integrasi Riset/PkM dalam RPS", "Ind. 15B - MBKM Berdampak"] },
            { kode: "B5_Luaran_Dampak_Pendidikan", label: "B5. Luaran Dampak Pendidikan", indikator: ["Ind. 17 - Sertifikasi Kompetensi DTPS", "Ind. 18 - RIPK Lulusan >= 3.25", "Ind. 23 - Tracer Study 5 Aspek", "Ind. 25B - Waktu tunggu <6 bulan"] }
        ]
    },
    {
        kode: "C_RELEVANSI_PENELITIAN", label: "C. Relevansi Penelitian",
        sub: [
            { kode: "C1_Masukan_Penelitian", label: "C1. Masukan Penelitian", indikator: ["Ind. 26 - Peta Jalan Penelitian", "Ind. 27 - Dana Penelitian DTPS 3 Tahun"] },
            { kode: "C2_Proses_Penelitian", label: "C2. Proses Penelitian", indikator: ["Ind. 29A - Keterlibatan Mahasiswa Riset DTPS"] },
            { kode: "C3_Luaran_Penelitian", label: "C3. Luaran Penelitian", indikator: ["Ind. 30A - Publikasi Ilmiah DTPS", "Ind. 30C - Sitasi Artikel DTPS", "Ind. 33A - HKI Luaran Penelitian DTPS"] }
        ]
    },
    {
        kode: "E_AKUNTABILITAS", label: "E. Akuntabilitas & Tata Kelola",
        sub: [
            { kode: "E1_Tata_Kelola_Organisasi", label: "E1. Tata Kelola Organisasi", indikator: ["Ind. 43A - Kebijakan Roadmap Pedoman", "Ind. 44 - Good Governance 6 Kaidah"] },
            { kode: "E6_Kerjasama_Rekognisi", label: "E6. Kerjasama Rekognisi", indikator: ["Ind. 58 - Kerjasama Tridharma", "Ind. 61A - Sertifikasi ISO Layanan", "Ind. 61B - Rekognisi Kepakaran DTPS"] }
        ]
    }
];

const INITIAL_DOCS = [
    { id: 'DOC-001', judul: 'SK Penetapan Visi Misi Prodi 2025', folderUtama: 'A_BUDAYA_MUTU', subFolder: 'A1_Tata_Kelola_SPMI', indikator: 'Ind. 1 - Kebijakan SPMI yang diacu UPPS', uploaderId: 'AG002', uploaderNama: 'Dr. Andi Pratama', tanggal: '2025-08-10', format: 'PDF', fileData: 'simulasi_file.pdf' },
    { id: 'DOC-002', judul: 'Laporan MBKM Mahasiswa Peternakan', folderUtama: 'B_RELEVANSI_PENDIDIKAN', subFolder: 'B4_Proses_Pembelajaran', indikator: 'Ind. 15B - MBKM Berdampak', uploaderId: 'AG004', uploaderNama: 'Budi Santoso, S.Pt.', tanggal: '2026-02-15', format: 'PDF', fileData: 'laporan_mbkm.pdf' },
    { id: 'DOC-003', judul: 'Data Dosen NDTPS 2025/2026', folderUtama: 'B_RELEVANSI_PENDIDIKAN', subFolder: 'B2_Sumber_Daya_Manusia', indikator: 'Ind. 8A - NDTPS >= 12', uploaderId: 'AG001', uploaderNama: 'Program Studi', tanggal: '2026-01-10', format: 'XLSX', fileData: 'data_dtps.xlsx' },
];

const INITIAL_NOTIFS = [
    { id: 1, to: 'ALL', msg: 'Persiapan Audit Eksternal LAM PTIP bulan depan. Harap lengkapi dokumen Indikator C.', date: '2026-03-25' },
    { id: 2, to: 'AG004', msg: 'Mohon perbarui Laporan RPS Produksi Ternak.', date: '2026-03-28' }
];


// ==========================================
// 2. COMPONENTS UTILITY
// ==========================================

const ModernInput = ({ label, type = 'text', value, onChange, disabled = false, placeholder, icon: Icon, required = false }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
        <div className="relative">
            {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon size={18} className="text-slate-400" /></div>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#b58500] focus:border-transparent block ${Icon ? 'pl-10' : 'p-3'} p-3 transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white'}`}
            />
        </div>
    </div>
);

const ModernSelect = ({ label, value, onChange, options, disabled = false, required = false }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#b58500] focus:border-transparent block p-3 transition-all appearance-none ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white'}`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
            <option value="">-- Pilih {label} --</option>
            {options.map((opt, i) => (
                <option key={i} value={typeof opt === 'object' ? opt.kode || opt.id : opt}>
                    {typeof opt === 'object' ? opt.label || opt.nama : opt}
                </option>
            ))}
        </select>
    </div>
);


// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================

const App = ({ initialUser = null, initialView = 'login', onLogout }) => {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState(initialView); // 'login' | 'dashboard'
    const [user, setUser] = useState(initialUser); // Current logged in user

    // Database States
    const [usersDb, setUsersDb] = useState(INITIAL_USERS);
    const [docsDb, setDocsDb] = useState(INITIAL_DOCS);
    const [notifsDb, setNotifsDb] = useState(INITIAL_NOTIFS);

    // Dashboard UI States
    const [activeMenu, setActiveMenu] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toast, setToast] = useState(null); // {type: 'success'|'error', msg: ''}

    // --- HELPER FUNCTIONS ---
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleLogin = (identifier, password) => {
        const found = usersDb.find(u => (u.nip === identifier || u.email === identifier) && u.password === password);
        if (found) {
            if (found.status !== 'Aktif') {
                showToast('Akun Anda dinonaktifkan/pensiun.', 'error');
                return;
            }
            setUser(found);
            setView('dashboard');
            setActiveMenu('overview');
            showToast(`Selamat datang, ${found.nama}`);
            window.location.hash = `#Dashboard${found.role.replace(' ', '')}#${found.id}`;
        } else {
            showToast('NIP/Email atau Password salah!', 'error');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setView('login');
        window.location.hash = `#Login`;
        if (onLogout) onLogout();
    };

    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            if (hash.includes('#Dashboard') && user) {
                // let it be
            } else if (!user) {
                setView('login');
            }
        };
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, [user]);


    // ==========================================
    // VIEW: LOGIN PAGE
    // ==========================================
    if (view === 'login') {
        return <LoginView onLogin={handleLogin} toast={toast} />;
    }

    // ==========================================
    // VIEW: DASHBOARD LAYOUT
    // ==========================================
    const MENU_ITEMS = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid, show: true },
        { id: 'unggah', label: 'Unggah Arsip', icon: UploadCloud, show: true },
        { id: 'lihat', label: 'Lihat Arsip', icon: FolderOpen, show: true },
        { id: 'akun', label: 'Manajemen Akun', icon: UserPlus, show: user?.role === 'Ultimate' || user?.role === 'Super Admin' },
        { id: 'petunjuk', label: 'Petunjuk Pengisian', icon: Info, show: true },
        { id: 'notifikasi', label: 'Notifikasi', icon: Bell, show: true },
        { id: 'profil', label: 'Profil Saya', icon: User, show: true },
    ];

    const handleMenuClick = (id) => {
        setActiveMenu(id);
        setIsMobileMenuOpen(false);
        window.location.hash = `#Dashboard${user.role.replace(' ', '')}#${user.id}#${id}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden text-slate-800">

            {/* TOAST NOTIFICATION */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100]">
                        <div className={`px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                            {toast.msg}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIDEBAR (DESKTOP & TABLET) */}
            <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 z-20 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#b58500] to-[#805d00] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#b58500]/30">S</div>
                    <div>
                        <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">SIPNAK</h1>
                        <p className="text-[10px] font-bold text-[#b58500] uppercase tracking-wider">Informasi dan Arsip Peternakan</p>
                    </div>
                </div>

                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <img src={user.foto} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-bold text-slate-800 truncate">{user.nama}</h2>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mt-1 ${user.role === 'Ultimate' ? 'bg-purple-100 text-purple-700' : user.role === 'Super Admin' ? 'bg-blue-100 text-blue-700' : 'bg-[#f9f1d8] text-[#805d00]'}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    {MENU_ITEMS.filter(m => m.show).map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeMenu === item.id ? 'bg-gradient-to-r from-[#b58500] to-[#805d00] text-white shadow-md shadow-[#b58500]/20 translate-x-1' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                        >
                            <item.icon size={20} className={activeMenu === item.id ? 'text-white' : 'text-slate-400'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={20} /> Keluar Sistem
                    </button>
                </div>
            </aside>

            {/* MOBILE HEADER (OPTIONAL BRANDING ONLY) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-[#b58500] to-[#805d00] rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
                    <h1 className="font-black text-lg text-slate-800 tracking-tight">SIPNAK</h1>
                </div>
                <div className="flex items-center gap-3">
                    <img src={user.foto} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                </div>
            </div>

            {/* MOBILE MORE MENU (Lainnya Popup) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="md:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl border-t border-slate-200 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-4 pb-6 space-y-2">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <h3 className="font-bold text-slate-800">Menu Lainnya</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X size={18} /></button>
                        </div>
                        {MENU_ITEMS.filter(m => m.show && !['overview', 'unggah', 'lihat', 'notifikasi'].includes(m.id)).map(item => (
                            <button key={item.id} onClick={() => handleMenuClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${activeMenu === item.id ? 'bg-[#f9f1d8] text-[#805d00]' : 'text-slate-600'}`}>
                                <item.icon size={20} /> {item.label}
                            </button>
                        ))}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 mt-4">
                            <LogOut size={20} /> Keluar Sistem
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE BOTTOM NAV BAR */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-slate-200 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="flex justify-around items-center h-16 px-2">
                    {MENU_ITEMS.filter(m => ['overview', 'unggah', 'lihat', 'notifikasi'].includes(m.id)).map(item => (
                        <button key={item.id} onClick={() => handleMenuClick(item.id)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeMenu === item.id ? 'text-[#b58500]' : 'text-slate-400'}`}>
                            <div className={`p-1.5 rounded-xl ${activeMenu === item.id ? 'bg-[#f9f1d8]' : ''}`}>
                                <item.icon size={20} className={activeMenu === item.id ? 'fill-[#b58500]/20' : ''} />
                            </div>
                            <span className="text-[10px] font-semibold">{item.label}</span>
                        </button>
                    ))}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isMobileMenuOpen ? 'text-[#b58500]' : 'text-slate-400'}`}>
                        <div className={`p-1.5 rounded-xl ${isMobileMenuOpen ? 'bg-[#f9f1d8]' : ''}`}>
                            <Menu size={20} className={isMobileMenuOpen ? 'fill-[#b58500]/20' : ''} />
                        </div>
                        <span className="text-[10px] font-semibold">Lainnya</span>
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50/50 pt-16 md:pt-0 relative pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 lg:pb-8">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeMenu}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeMenu === 'overview' && <DashboardOverview docs={docsDb} users={usersDb} user={user} />}
                            {activeMenu === 'unggah' && <UnggahArsip user={user} setDocsDb={setDocsDb} docsDb={docsDb} showToast={showToast} />}
                            {activeMenu === 'lihat' && <LihatArsip docsDb={docsDb} setDocsDb={setDocsDb} user={user} showToast={showToast} />}
                            {activeMenu === 'akun' && (user.role === 'Ultimate' || user.role === 'Super Admin') && <ManajemenAkun usersDb={usersDb} setUsersDb={setUsersDb} currentUser={user} showToast={showToast} />}
                            {activeMenu === 'petunjuk' && <PetunjukPengisian />}
                            {activeMenu === 'notifikasi' && <Notifikasi notifs={notifsDb} user={user} setNotifsDb={setNotifsDb} showToast={showToast} />}
                            {activeMenu === 'profil' && <ProfilSaya user={user} />}
                        </motion.div>
                    </AnimatePresence>

                </div>
            </main>

        </div>
    );
};


// ==========================================
// SUB-COMPONENTS (VIEWS)
// ==========================================

// --- LOGIN VIEW ---
const LoginView = ({ onLogin, toast }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#b58500]/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]"></div>

            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="absolute top-10 z-50">
                        <div className="px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 bg-red-500 text-white">
                            <AlertCircle size={18} /> {toast.msg}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-[#b58500] to-[#805d00] rounded-2xl mx-auto flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg shadow-[#b58500]/40">S</div>
                    <h1 className="text-3xl font-black text-white tracking-tight">SIPNAK Access</h1>
                    <p className="text-slate-400 text-sm mt-2">Masuk ke Dashboard Informasi dan Arsip Peternakan</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onLogin(identifier, password); }} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">NIP / Email Account</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                            <input required type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-[#b58500] focus:border-transparent block pl-12 p-3.5 transition-all outline-none" placeholder="Masukkan NIP atau Email..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-slate-400" /></div>
                            <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-[#b58500] focus:border-transparent block pl-12 pr-12 p-3.5 transition-all outline-none" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-[#b58500] to-[#805d00] hover:from-[#d4a31a] hover:to-[#9c7200] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#b58500]/30 transition-all transform active:scale-95 flex justify-center items-center gap-2 mt-4">
                        <LogIn size={20} /> Masuk Sistem
                    </button>
                </form>

                <div className="mt-8 text-center bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-400 font-medium">Test Accounts:</p>
                    <p className="text-[10px] text-slate-500 mt-1">NIP: 2982019 (Ultimate) | NIP: 1987654321001 (SuperAdmin)<br />NIP: 1987654321003 (Admin) | Pass: ultimate123/superadmin123/admin123</p>
                </div>
            </motion.div>
        </div>
    );
};

// --- OVERVIEW VIEW ---
const DashboardOverview = ({ docs, users, user }) => {
    const [filterKategori, setFilterKategori] = useState('');

    const filteredDocs = filterKategori ? docs.filter(d => d.folderUtama === filterKategori) : docs;
    const myDocs = filteredDocs.filter(d => d.uploaderId === user.id).length;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
                <div className="relative z-10 flex flex-col gap-2">
                    <h2 className="text-2xl md:text-3xl font-black mb-1">Dashboard {user.role}</h2>
                    <p className="text-slate-400 text-sm md:text-base">Selamat datang kembali, {user.nama}. Sistem IAPS 1.0 LAM PTIP aktif.</p>
                </div>
            </div>

            {/* Filter Kategori Arsip */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Filter size={20} /></div>
                    <h3 className="font-bold text-slate-800 text-sm">Filter Overview Arsip:</h3>
                </div>
                <select
                    value={filterKategori}
                    onChange={(e) => setFilterKategori(e.target.value)}
                    className="w-full md:w-96 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-[#b58500] outline-none p-3 appearance-none cursor-pointer hover:bg-white transition-colors"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                    <option value="">Tampilkan Semua Kategori (Akumulasi)</option>
                    {IAPS_STRUCTURE.map((k, i) => (
                        <option key={i} value={k.kode}>{k.label}</option>
                    ))}
                </select>
            </div>

            {/* Stats Boxes (Updated) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Archive size={26} /></div>
                    <div><p className="text-sm font-bold text-slate-400">Jumlah Seluruh Arsip</p><p className="text-3xl font-black text-slate-800">{filteredDocs.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><FolderOpen size={26} /></div>
                    <div><p className="text-sm font-bold text-slate-400">Arsip Saya</p><p className="text-3xl font-black text-slate-800">{myDocs}</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center"><User size={26} /></div>
                    <div><p className="text-sm font-bold text-slate-400">Total Pengguna</p><p className="text-3xl font-black text-slate-800">{users.length}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-black text-slate-800 mb-4">Aktivitas Arsip Terbaru</h3>
                <div className="space-y-4">
                    {filteredDocs.slice(-5).reverse().map(d => (
                        <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#f9f1d8] text-[#805d00] rounded-xl flex items-center justify-center"><Archive size={18} /></div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{d.judul}</p>
                                    <p className="text-xs text-slate-500">{d.indikator} • Oleh {d.uploaderNama}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 hidden md:block">{d.tanggal}</span>
                        </div>
                    ))}
                    {filteredDocs.length === 0 && <p className="text-slate-400 text-center py-4">Belum ada arsip pada kategori ini.</p>}
                </div>
            </div>
        </div>
    );
};

// --- UPLOAD ARSIP VIEW ---
const UnggahArsip = ({ user, setDocsDb, docsDb, showToast }) => {
    const [formData, setFormData] = useState({ judul: '', folderUtama: '', subFolder: '', indikator: '', format: 'PDF', file: null });
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const availableSubfolders = useMemo(() => {
        if (!formData.folderUtama) return [];
        const folder = IAPS_STRUCTURE.find(f => f.kode === formData.folderUtama);
        return folder ? folder.sub : [];
    }, [formData.folderUtama]);

    const availableIndikators = useMemo(() => {
        if (!formData.subFolder) return [];
        const sub = availableSubfolders.find(s => s.kode === formData.subFolder);
        return sub ? sub.indikator : [];
    }, [formData.subFolder, availableSubfolders]);

    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else if (e.type === "dragleave") setDragActive(false); };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) setFormData({ ...formData, file: e.dataTransfer.files[0] }); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.file) return showToast("File dokumen wajib diunggah!", "error");

        const newDoc = {
            id: `DOC-${Date.now()}`,
            judul: formData.judul, folderUtama: formData.folderUtama, subFolder: formData.subFolder, indikator: formData.indikator,
            format: formData.file.name.split('.').pop().toUpperCase(), fileData: formData.file.name,
            uploaderId: user.id, uploaderNama: user.nama, tanggal: new Date().toISOString().split('T')[0]
        };

        setDocsDb([...docsDb, newDoc]);
        showToast("Arsip berhasil diunggah sesuai standar IAPS 1.0!");
        setFormData({ judul: '', folderUtama: '', subFolder: '', indikator: '', format: 'PDF', file: null });
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800">Unggah Arsip Digital</h2>
                <p className="text-slate-500 text-sm mt-1">Sistem otomatis mengklasifikasikan dokumen berdasarkan pedoman IAPS 1.0 LAM PTIP.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModernInput label="Judul Dokumen (Sesuai Nomenklatur)" required value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} placeholder="Misal: SK Rektor tentang Organ Penjaminan Mutu" icon={FileText} />

                    <ModernSelect label="Kriteria Akreditasi (Folder Utama)" required value={formData.folderUtama} onChange={(e) => setFormData({ ...formData, folderUtama: e.target.value, subFolder: '', indikator: '' })}
                        options={IAPS_STRUCTURE.map(f => ({ kode: f.kode, label: f.label }))} />

                    <ModernSelect label="Sub Kriteria (Sub Folder)" required disabled={!formData.folderUtama} value={formData.subFolder} onChange={(e) => setFormData({ ...formData, subFolder: e.target.value, indikator: '' })}
                        options={availableSubfolders.map(s => ({ kode: s.kode, label: s.label }))} />

                    <ModernSelect label="Indikator Pemenuhan Skor 4" required disabled={!formData.subFolder} value={formData.indikator} onChange={(e) => setFormData({ ...formData, indikator: e.target.value })}
                        options={availableIndikators} />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Pilih File Dokumen Asli <span className="text-red-500">*</span></label>
                    <div
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragActive ? 'border-[#b58500] bg-[#fdfbf2]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} cursor-pointer`}
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { if (e.target.files[0]) setFormData({ ...formData, file: e.target.files[0] }) }} accept=".pdf,.doc,.docx,.xls,.xlsx" />

                        {formData.file ? (
                            <div className="flex flex-col items-center gap-2">
                                <FileIcon size={40} className="text-[#b58500]" />
                                <p className="font-bold text-slate-800">{formData.file.name}</p>
                                <p className="text-xs text-slate-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, file: null }) }} className="text-xs text-red-500 font-bold hover:underline mt-2">Ganti File</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <UploadCloud size={48} className="text-slate-400" />
                                <p className="text-sm font-bold text-slate-600">Klik atau Drag & Drop file ke area ini</p>
                                <p className="text-xs text-slate-400">Mendukung PDF, DOCX, XLSX (Max 50MB)</p>
                                <div className="bg-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold mt-2">Sistem Database Lokal Terenkripsi</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" className="bg-gradient-to-r from-[#b58500] to-[#805d00] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-[#b58500]/30 hover:scale-105 transition-transform flex items-center gap-2">
                        <Archive size={20} /> Simpan ke Arsip Digital
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- LIHAT ARSIP VIEW ---
const LihatArsip = ({ docsDb, setDocsDb, user, showToast }) => {
    const [search, setSearch] = useState('');

    const canEdit = (doc) => user.role === 'Ultimate' || user.role === 'Super Admin' || doc.uploaderId === user.id;

    const filteredDocs = docsDb.filter(d =>
        d.judul.toLowerCase().includes(search.toLowerCase()) ||
        d.indikator.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm("Yakin menghapus dokumen ini secara permanen?")) {
            setDocsDb(docsDb.filter(d => d.id !== id));
            showToast("Dokumen berhasil dihapus.");
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Database Arsip</h2>
                    <p className="text-slate-500 text-sm mt-1">Daftar kelengkapan dokumen IAPS 1.0 LAM PTIP.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <input type="text" placeholder="Cari arsip..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#b58500] outline-none" />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filteredDocs.map((doc) => (
                            <motion.div key={doc.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg ${doc.format === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {doc.format === 'PDF' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{doc.tanggal}</span>
                                </div>

                                <h3 className="font-bold text-slate-800 text-base leading-tight mb-2 line-clamp-2">{doc.judul}</h3>
                                <div className="mt-auto pt-3 space-y-2">
                                    <p className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold truncate">{doc.indikator}</p>
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1"><User size={12} /> {doc.uploaderNama}</p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                                    <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"><Eye size={14} /> Lihat</button>
                                    {canEdit(doc) && (
                                        <button onClick={() => handleDelete(doc.id)} className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"><Trash2 size={14} /> Hapus</button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredDocs.length === 0 && <div className="col-span-full text-center py-10 text-slate-400">Tidak ada dokumen ditemukan.</div>}
                </div>
            </div>
        </div>
    );
};

// --- MANAJEMEN AKUN VIEW (ULTIMATE / SUPER ADMIN) ---
const ManajemenAkun = ({ usersDb, setUsersDb, currentUser, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: '', nip: '', nama: '', email: '', password: '', role: 'Admin', jabatan: '', bio: '', matkul: '', status: 'Aktif', tahunAjaran: '2025/2026' });

    const isUltimate = currentUser.role === 'Ultimate';

    const openModal = (user = null) => {
        if (user) { setFormData(user); setEditMode(true); }
        else {
            // Auto ID Generation
            const newId = `AG00${usersDb.length + 1}`;
            setFormData({ id: newId, nip: '', nama: '', email: '', password: '', role: 'Admin', jabatan: 'Dosen', bio: '', matkul: '', status: 'Aktif', tahunAjaran: '2025/2026', foto: `https://ui-avatars.com/api/?name=New+User&background=b58500&color=fff` });
            setEditMode(false);
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editMode) {
            setUsersDb(usersDb.map(u => u.id === formData.id ? formData : u));
            showToast("Data akun berhasil diperbarui.");
        } else {
            setUsersDb([...usersDb, formData]);
            showToast("Akun baru berhasil dibuat.");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (!isUltimate) return showToast("Hanya Ultimate yang dapat menghapus akun!", "error");
        if (id === currentUser.id) return showToast("Tidak dapat menghapus akun sendiri!", "error");
        if (window.confirm("Hapus akun dosen ini permanen?")) {
            setUsersDb(usersDb.filter(u => u.id !== id));
            showToast("Akun berhasil dihapus.");
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Manajemen Akses & Dosen</h2>
                    <p className="text-slate-500 text-sm mt-1">Role Anda: <span className="font-bold text-[#b58500]">{currentUser.role}</span></p>
                </div>
                {isUltimate && (
                    <button onClick={() => openModal()} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
                        <Plus size={18} /> Tambah Dosen
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-auto p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID / NIP</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Dosen</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {usersDb.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 align-top">
                                    <div className="font-black text-slate-800 text-sm">{u.id}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-1">{u.nip}</div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="flex items-center gap-3">
                                        <img src={u.foto} alt="Profile" className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div>
                                            <div className="font-bold text-sm text-slate-800">{u.nama}</div>
                                            <div className="text-xs text-slate-500">{u.email} • {u.jabatan}</div>
                                            <div className="text-[10px] bg-blue-50 text-blue-600 inline-block px-2 py-0.5 rounded mt-1 font-semibold">{u.tahunAjaran}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 align-top">
                                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-1 ${u.role === 'Ultimate' ? 'bg-purple-100 text-purple-700' : u.role === 'Super Admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                                        {u.role}
                                    </span><br />
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${u.status === 'Aktif' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'}`}></span> {u.status}
                                    </span>
                                </td>
                                <td className="p-4 align-top text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openModal(u)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit size={16} /></button>
                                        {isUltimate && u.id !== currentUser.id && (
                                            <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL FORM */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="text-xl font-black text-slate-800">{editMode ? 'Edit Akun Dosen' : 'Tambah Dosen Baru'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-red-500"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 flex-1 overflow-y-auto space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <ModernInput label="ID Sistem (Otomatis)" value={formData.id} disabled />
                                    <ModernInput label="NIP" required value={formData.nip} onChange={e => setFormData({ ...formData, nip: e.target.value })} />
                                    <div className="col-span-2"><ModernInput label="Nama Lengkap & Gelar" required value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} /></div>
                                    <ModernInput label="Email Akun" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    <ModernInput label="Password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

                                    <ModernSelect label="Role Sistem" value={formData.role} disabled={!isUltimate} onChange={e => setFormData({ ...formData, role: e.target.value })} options={['Admin', 'Super Admin', 'Ultimate']} />
                                    <ModernSelect label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={['Aktif', 'Pensiun', 'Cuti']} />

                                    <ModernInput label="Jabatan Prodi" value={formData.jabatan} onChange={e => setFormData({ ...formData, jabatan: e.target.value })} />
                                    <ModernInput label="Tahun Ajaran Aktif" value={formData.tahunAjaran} onChange={e => setFormData({ ...formData, tahunAjaran: e.target.value })} />

                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mata Kuliah Diampu</label>
                                        <textarea value={formData.matkul} onChange={e => setFormData({ ...formData, matkul: e.target.value })} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-[#b58500]"></textarea>
                                    </div>
                                </div>
                                <div className="pt-6 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Batal</button>
                                    <button type="submit" className="bg-[#b58500] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#9c7200] shadow-lg shadow-[#b58500]/30">Simpan Data</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- PETUNJUK PENGISIAN VIEW ---
const PetunjukPengisian = () => (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 bg-[#f9f1d8] text-[#805d00] rounded-2xl flex items-center justify-center"><Book size={28} /></div>
            <div>
                <h2 className="text-2xl font-black text-slate-800">Buku Panduan IAPS 1.0</h2>
                <p className="text-slate-500 text-sm">Standar Perolehan Skor 4 per Indikator - LAM PTIP 2025</p>
            </div>
        </div>
        <div className="space-y-4">
            <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                <h3 className="font-bold text-blue-800 text-lg mb-2">Penamaan Folder Otomatis</h3>
                <p className="text-sm text-blue-700 leading-relaxed">Sistem SIPNAK telah mengadopsi format konvensi hierarkis tiga level secara otomatis di latar belakang: <br /><strong>Level 1:</strong> [Kode Kriteria] — Nama Kriteria<br /><strong>Level 2:</strong> [Kode.Sub] — Kelompok Indikator<br /><strong>Level 3:</strong> [Kode.Sub.Huruf] — Nama Dokumen</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {IAPS_STRUCTURE.map((kriteria, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl p-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-3 text-[#b58500]">{kriteria.label}</h4>
                        <ul className="space-y-2">
                            {kriteria.sub.slice(0, 3).map((s, i) => (
                                <li key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{s.label}</li>
                            ))}
                            {kriteria.sub.length > 3 && <li className="text-xs text-slate-400 italic px-2">+ {kriteria.sub.length - 3} sub kriteria lainnya...</li>}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- NOTIFIKASI VIEW ---
const Notifikasi = ({ notifs, user, setNotifsDb, showToast }) => {
    const [msg, setMsg] = useState('');

    const myNotifs = notifs.filter(n => n.to === 'ALL' || n.to === user.id).reverse();
    const canSend = user.role === 'Ultimate' || user.role === 'Super Admin';

    const sendNotif = (e) => {
        e.preventDefault();
        if (!msg) return;
        setNotifsDb([...notifs, { id: Date.now(), to: 'ALL', msg, date: new Date().toISOString().split('T')[0] }]);
        setMsg('');
        showToast("Notifikasi broadcast berhasil dikirim.");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 h-[calc(100vh-8rem)] overflow-y-auto">
                <h2 className="text-2xl font-black text-slate-800 mb-6">Pemberitahuan Sistem</h2>
                <div className="space-y-4">
                    {myNotifs.map(n => (
                        <div key={n.id} className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0"><Bell size={18} /></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{n.msg}</p>
                                <p className="text-xs text-slate-400 mt-2 font-mono">{n.date} {n.to === 'ALL' ? '• Siaran Publik' : '• Pesan Pribadi'}</p>
                            </div>
                        </div>
                    ))}
                    {myNotifs.length === 0 && <p className="text-slate-500 text-center py-10">Tidak ada notifikasi.</p>}
                </div>
            </div>

            {canSend && (
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white h-fit shadow-xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={20} className="text-[#b58500]" /> Buat Pengumuman</h3>
                    <form onSubmit={sendNotif}>
                        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Tulis instruksi untuk semua dosen..." className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#b58500] h-32 mb-4 placeholder-slate-400"></textarea>
                        <button type="submit" className="w-full bg-gradient-to-r from-[#b58500] to-[#805d00] font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform">Kirim Broadcast</button>
                    </form>
                </div>
            )}
        </div>
    );
};

// --- PROFIL SAYA VIEW ---
const ProfilSaya = ({ user }) => (
    <div className="flex justify-center w-full">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden max-w-4xl w-full">

            {/* Cover Background */}
            <div className="h-48 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
                {/* Role Badge di Pojok Kanan Atas */}
                <div className="absolute top-6 right-6">
                    <span className="px-4 py-1.5 bg-[#f9f1d8] text-[#805d00] font-black text-xs rounded-xl uppercase tracking-wider shadow-sm">
                        {user.role}
                    </span>
                </div>
            </div>

            {/* Foto Profil Diletakkan di Luar Cover dengan Negative Margin */}
            <div className="flex justify-center -mt-20 relative z-10">
                <div className="p-2 bg-white rounded-[2rem] shadow-sm">
                    <img src={user.foto} alt="Profile" className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover" />
                </div>
            </div>

            <div className="pt-6 p-8 md:p-12">
                {/* Informasi Header Profil (Tengah) */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-800 leading-tight mb-2 px-4">{user.nama}</h2>
                    <p className="text-[#b58500] font-bold text-lg mb-6">{user.jabatan}</p>

                    {/* Bio Profil */}
                    <div className="max-w-2xl mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Bio Profil</p>
                        <p className="text-slate-700 font-medium italic">"{user.bio || 'Belum ada deskripsi profil.'}"</p>
                    </div>
                </div>

                {/* Grid Data NIP, ID, Dll */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">NIP Dosen</p>
                        <p className="font-mono text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{user.nip}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sistem ID</p>
                        <p className="font-mono text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{user.id}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                        <p className="text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{user.email}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tahun Ajaran Aktif</p>
                        <p className="text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{user.tahunAjaran}</p>
                    </div>
                    <div className="md:col-span-2 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mata Kuliah Diampu</p>
                        <p className="text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{user.matkul || '-'}</p>
                    </div>
                </div>

                <p className="text-xs text-slate-400 text-center mt-10 pt-6 border-t border-slate-100">
                    Untuk perubahan data mandiri, harap hubungi Ultimate Admin.
                </p>
            </div>
        </div>
    </div>
);

// Lucide Icons that were missing in the imports but used
const Activity = ({ size, className }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;

export default App;