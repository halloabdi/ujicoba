import React, { useState, useEffect, useMemo } from 'react';
import {
  Archive, Zap, ShieldCheck, Monitor, TrendingUp,
  Search, X, Eye, Download, LayoutGrid,
  FolderOpen, Info, LogIn, Filter, ChevronLeft, ChevronRight,
  FileText, Calendar, User, Lock, Book
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginDashboard, { INITIAL_USERS } from './Login-Dashboard.jsx';

// ==========================================
// CONFIGURATION & DUMMY DATA
// ==========================================

const MASTER_FOLDER_IAPS = [
  {
    kodeFolderUtama: "A_BUDAYA_MUTU",
    namaKriteria: "Budaya Mutu (Sistem Penjaminan Mutu Internal)",
    kodeSubFolder: "A1_Tata_Kelola_SPMI",
    indikator: "Ind. 1-Tersedianya organ dan tupoksi penjaminan mutu di level UPPS",
    namaDokumen: "A1a_SK_Organ_Penjaminan_Mutu.pdf",
    standarSkor: "SK Rektor/Dekan tentang pembentukan LPM/LPMU dan GKM Prodi yang masih berlaku..."
  },
  {
    kodeFolderUtama: "A_BUDAYA_MUTU",
    namaKriteria: "Budaya Mutu (Sistem Penjaminan Mutu Internal)",
    kodeSubFolder: "A1_Tata_Kelola_SPMI",
    indikator: "Ind. 1- Kebijakan SPMI yang diacu UPPS",
    namaDokumen: "A1b_Kebijakan_SPMI.pdf",
    standarSkor: "Dokumen Kebijakan SPMI yang ditetapkan pimpinan PT (Surat Keputusan), mencakup: ruang lingkup..."
  },
  {
    kodeFolderUtama: "A_BUDAYA_MUTU",
    namaKriteria: "Budaya Mutu (Sistem Penjaminan Mutu Internal)",
    kodeSubFolder: "A2_Pelaksanaan_PPEPP",
    indikator: "Ind. 2- Siklus PPEPP terlaksana di bidang akademik",
    namaDokumen: "A2a_PPEPP_Bidang_Akademik.pdf",
    standarSkor: "Bukti kuat dan lengkap bahwa siklus PPEPP telah diterapkan pada: (a) pengelolaan kurikulum..."
  },
  {
    kodeFolderUtama: "B_RELEVANSI_PENDIDIKAN",
    namaKriteria: "Pendidikan (Kurikulum, Pembelajaran, Luaran)",
    kodeSubFolder: "B1_Kurikulum_Materi",
    indikator: "Ind. 5- Aspek A: Keterlibatan pemangku kepentingan aktif dalam evaluasi & pemutakhiran OBE",
    namaDokumen: "B1a_Dokumen_Kurikulum_OBE.pdf",
    standarSkor: "Notulen rapat tinjauan kurikulum bersama stakeholder (industri peternakan/agribisnis, alumni..."
  },
  {
    kodeFolderUtama: "B_RELEVANSI_PENDIDIKAN",
    namaKriteria: "Pendidikan (Kurikulum, Pembelajaran, Luaran)",
    kodeSubFolder: "B2_Sumber_Daya_Manusia",
    indikator: "Ind. 8A-NDTPS ≥12",
    namaDokumen: "B2b_Data_DTPS_dan_Beban_Mengajar.xlsx",
    standarSkor: "Tabel data DTPS minimal 12 orang: nama, NIDN, bidang keahlian, kesesuaian dengan kompetensi inti prodi..."
  },
  {
    kodeFolderUtama: "C_RELEVANSI_PENELITIAN",
    namaKriteria: "Relevansi Penelitian (Roadmap, Dana, Publikasi)",
    kodeSubFolder: "C1_Masukan_Penelitian",
    indikator: "Ind. 26-Peta jalan penelitian sangat relevan, terintegrasi roadmap prodi...",
    namaDokumen: "C1a_Peta_Jalan_Penelitian_UPPS.pdf",
    standarSkor: "Dokumen roadmap penelitian UPPS yang terintegrasi dengan tema riset prodi Agribisnis Peternakan..."
  },
  {
    kodeFolderUtama: "E_AKUNTABILITAS",
    namaKriteria: "Akuntabilitas (Tata Kelola, SDM, Investasi, Kerjasama)",
    kodeSubFolder: "E6_Kerjasama_Rekognisi",
    indikator: "Ind. 61A-≥4 jenis akreditasi/sertifikasi ISO layanan",
    namaDokumen: "E6d_Akreditasi_Sertifikasi_ISO.pdf",
    standarSkor: "Sertifikat akreditasi/sertifikasi ISO yang masih berlaku, mencakup ≥4 jenis: ISO 9001 (SMM)..."
  }
];

const DUMMY_DOCS = [
  {
    id: "2023-05-12 10:00:00",
    timestamp: "2023-05-12 10:00:00",
    nama: "Ir. Soeraso, MP",
    nip: "1987654321004",
    jabatan: "Dosen",
    kodeFolderUtama: "B_RELEVANSI_PENDIDIKAN",
    kodeSubFolder: "B3_Sarana_Prasarana",
    judul: "Modul Praktikum Produksi Ternak",
    indikator: "Ind. 10-Kriteria 4: Tersedia instrumen/modul praktikum",
    kategori: "Umum",
    privasi: "Publik",
    passdok: "-",
    versi: "v1.0",
    statusDokumen: "Final",
    expired: "-",
    ringkasan: "Modul ini berisi panduan teknis pelaksanaan praktikum produksi ternak bagi mahasiswa. Di dalamnya terdapat prosedur keselamatan di laboratorium dan tata cara penanganan ternak yang baik. Modul ini wajib digunakan selama kegiatan praktikum semester genap.",
    format: "PDF",
    kepentingan: "Penting",
    tahun: "2022/2023",
    url: "https://drive.google.com/file/d/1vC0iyP_CDQ1568YjhFcAclGC_xC_KIxC/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2025-08-10 09:30:00",
    timestamp: "2025-08-10 09:30:00",
    nama: "Dr. Andi Pratama, S.Pt., M.P.",
    nip: "1987654321001",
    jabatan: "Ketua Program Studi",
    kodeFolderUtama: "F_DIFERENSIASI_MISI",
    kodeSubFolder: "F1_Misi_Renstra_UPPS",
    judul: "SK Penetapan Visi Misi Prodi",
    indikator: "Ind. 62A-Misi memenuhi 3 aspek: terukur, sumber daya memadai, daya saing nasional/internasional",
    kategori: "Umum",
    privasi: "Publik",
    passdok: "-",
    versi: "v1.0",
    statusDokumen: "Final",
    expired: "2030-08-10",
    ringkasan: "Dokumen ini merupakan Surat Keputusan resmi terkait penetapan visi dan misi program studi yang baru. Perubahan ini disesuaikan dengan rencana strategis institusi untuk lima tahun ke depan. SK ini menjadi landasan seluruh kegiatan akademik dan tridharma perguruan tinggi.",
    format: "PDF",
    kepentingan: "Sangat Penting",
    tahun: "2025/2026",
    url: "https://drive.google.com/file/d/1pI_NNz1YQpCtVHbn9aV6vK8fWZXZsbc_/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2025-09-12 15:30:00",
    timestamp: "2025-09-12 15:30:00",
    nama: "Dr. Andi Pratama, S.Pt., M.P.",
    nip: "1987654321001",
    jabatan: "Ketua Program Studi",
    kodeFolderUtama: "E_AKUNTABILITAS",
    kodeSubFolder: "E6_Kerjasama_Rekognisi",
    judul: "Dokumen Kerjasama Industri (MoU)",
    indikator: "Ind. 60-RMKI ≤6",
    kategori: "Umum",
    privasi: "Publik",
    passdok: "-",
    versi: "v1.0",
    statusDokumen: "Final",
    expired: "2028-09-12",
    ringkasan: "Naskah kerjasama ini dijalankan dengan perusahaan peternakan skala nasional untuk program magang mahasiswa. Manfaat kerjasama mencakup peningkatan kinerja tridharma dan fasilitas pendukung pembelajaran praktikum. Keberlanjutan kerjasama ini dijamin melalui mekanisme evaluasi kepuasan mitra secara berkala.",
    format: "PDF",
    kepentingan: "Sangat Penting",
    tahun: "2025/2026",
    url: "https://drive.google.com/file/d/1xPROzl7mnhJlli84EfERTmAXL-uVEHZl/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2026-02-15 11:20:00",
    timestamp: "2026-02-15 11:20:00",
    nama: "Budi Santoso, S.Pt.",
    nip: "1987654321003",
    jabatan: "Dosen",
    kodeFolderUtama: "B_RELEVANSI_PENDIDIKAN",
    kodeSubFolder: "B4_Proses_Pembelajaran",
    judul: "Laporan Kegiatan MBKM Mahasiswa",
    indikator: "Ind. 15B PKMEMBKM ≥15%",
    kategori: "Umum",
    privasi: "Publik",
    passdok: "-",
    versi: "v1.0",
    statusDokumen: "Final",
    expired: "-",
    ringkasan: "Laporan ini mendokumentasikan partisipasi mahasiswa dalam program Merdeka Belajar Kampus Merdeka (MBKM) di sektor industri. Kegiatan ini memberikan dampak signifikan terhadap peningkatan kompetensi praktis mahasiswa di luar kampus. Seluruh aktivitas mahasiswa dalam program ini telah direkognisi ke dalam satuan kredit semester (SKS) yang relevan.",
    format: "PDF",
    kepentingan: "Biasa",
    tahun: "2025/2026",
    url: "https://drive.google.com/file/d/1rV7_ljkLlPGA7mvqvTPgfEc51V_pg9Em/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1594705382022-779836528751?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "2026-03-01 09:00:00",
    timestamp: "2026-03-01 09:00:00",
    nama: "Program Studi Agribisnis Peternakan",
    nip: "2982019",
    jabatan: "Program Studi",
    kodeFolderUtama: "E_AKUNTABILITAS",
    kodeSubFolder: "E6_Kerjasama_Rekognisi",
    judul: "Sertifikat ISO 9001:2015 Laboratorium",
    indikator: "Ind. 61A-24 jenis akreditasi/sertifikasi ISO layanan",
    kategori: "Umum",
    privasi: "Publik",
    passdok: "-",
    versi: "v1.0",
    statusDokumen: "Final",
    expired: "2029-03-01",
    ringkasan: "Sertifikat ini merupakan pengakuan eksternal terhadap standar sistem manajemen mutu yang diterapkan di laboratorium prodi. Pencapaian ini membuktikan komitmen UPPS dalam menyediakan fasilitas sarana prasarana yang bermutu baik. Dokumen ini sangat mendukung penilaian akuntabilitas dan kredibilitas tata pamong program studi.",
    format: "PDF",
    kepentingan: "Penting",
    tahun: "2025/2026",
    url: "https://drive.google.com/file/d/1qVg67IHRI8s884o-hmBwEoMWF7qJOkGb/view?usp=drive_link",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop"
  }
];

// Generate extra dummy docs to show pagination properly
const EXTENDED_DOCS = [...DUMMY_DOCS];
for (let i = 1; i <= 10; i++) {
  EXTENDED_DOCS.push({
    ...DUMMY_DOCS[i % DUMMY_DOCS.length],
    id: `${DUMMY_DOCS[i % DUMMY_DOCS.length].timestamp}-copy-${i}`,
    judul: `${DUMMY_DOCS[i % DUMMY_DOCS.length].judul} (Copy ${i})`,
  });
}

// ==========================================
// COMPONENTS
// ==========================================

const Header = ({ currentSection, setCurrentSection, onLoginClick }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const smoothScroll = (id) => {
    setCurrentSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = isMobile ? 0 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] rounded-t-3xl pb-safe pt-2 px-1 sm:px-2 transition-all">
        <div className="flex justify-around items-center h-16">
          <button onClick={() => smoothScroll('beranda')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentSection === 'beranda' ? 'text-[#b58500]' : 'text-slate-400 hover:text-[#b58500]'}`}>
            <div className={`p-1.5 rounded-xl ${currentSection === 'beranda' ? 'bg-[#f9f1d8]' : ''}`}>
              <LayoutGrid size={20} className={currentSection === 'beranda' ? 'fill-[#b58500]/20' : ''} />
            </div>
            <span className="text-[10px] font-semibold">Beranda</span>
          </button>
          <button onClick={() => smoothScroll('tentang')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentSection === 'tentang' ? 'text-[#b58500]' : 'text-slate-400 hover:text-[#b58500]'}`}>
            <div className={`p-1.5 rounded-xl ${currentSection === 'tentang' ? 'bg-[#f9f1d8]' : ''}`}>
              <Info size={20} className={currentSection === 'tentang' ? 'fill-[#b58500]/20' : ''} />
            </div>
            <span className="text-[10px] font-semibold">Tentang</span>
          </button>
          <button onClick={() => smoothScroll('arsip')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${currentSection === 'arsip' ? 'text-[#b58500]' : 'text-slate-400 hover:text-[#b58500]'}`}>
            <div className={`p-1.5 rounded-xl ${currentSection === 'arsip' ? 'bg-[#f9f1d8]' : ''}`}>
              <FolderOpen size={20} className={currentSection === 'arsip' ? 'fill-[#b58500]/20' : ''} />
            </div>
            <span className="text-[10px] font-semibold">Arsip</span>
          </button>
          <button onClick={onLoginClick} className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-all text-slate-400 hover:text-[#b58500]">
            <div className="p-1.5 rounded-xl text-red-500">
              <LogIn size={20} />
            </div>
            <span className="text-[10px] font-semibold text-red-500">Login</span>
          </button>
        </div>
      </nav>
    );
  }

  // Desktop Header
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all w-full">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => smoothScroll('beranda')}>
            <img src="https://black-ernesta-5.tiiny.site/2023-09-25-044131-264403Logo-kabupaten-Bangkalan.svg" alt="SIPNAK Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-slate-800 tracking-tight">SIPNAK</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => smoothScroll('beranda')} className={`text-sm font-semibold transition-colors ${currentSection === 'beranda' ? 'text-[#b58500]' : 'text-slate-500 hover:text-[#b58500]'}`}>Beranda</button>
            <button onClick={() => smoothScroll('tentang')} className={`text-sm font-semibold transition-colors ${currentSection === 'tentang' ? 'text-[#b58500]' : 'text-slate-500 hover:text-[#b58500]'}`}>Tentang Kami</button>
            <button onClick={() => smoothScroll('arsip')} className={`text-sm font-semibold transition-colors ${currentSection === 'arsip' ? 'text-[#b58500]' : 'text-slate-500 hover:text-[#b58500]'}`}>Arsip Dokumen</button>
          </div>

          <div>
            <button onClick={onLoginClick} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#b58500] to-[#805d00] hover:from-slate-900 hover:to-slate-900 active:from-slate-900 active:to-slate-900 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-slate-900/30 transition-all transform hover:-translate-y-0.5">
              <LogIn size={18} />
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="beranda" className="relative pt-16 md:pt-36 pb-8 md:pb-12 overflow-hidden bg-slate-50 w-full flex flex-col justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b58500]/20 rounded-full blur-[100px] -z-10 transform-gpu pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-[100px] -z-10 transform-gpu pointer-events-none"></div>

      <div className="w-full px-4 md:px-8 lg:px-12 text-center z-10 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

          <h1 className="font-extrabold mb-5 flex flex-col items-center">
            <span className="block text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] text-transparent bg-clip-text bg-gradient-to-r from-[#b58500] to-[#805d00] drop-shadow-sm leading-none tracking-normal">SIPNAK</span>
            <span className="block text-sm sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold text-slate-800 -mt-1 md:-mt-4 tracking-wide px-2 md:px-0">
              Sistem Informasi dan Arsip Peternakan
            </span>
            <span className="block text-xs sm:text-sm md:text-base font-semibold text-slate-500 mt-2 tracking-wide px-2 md:px-0">
              Dari Dinas Peternakan dan Kesehatan Bangkalan untuk Masyarakat Bangkalan
            </span>
          </h1>

          <div className="max-w-2xl mx-auto relative mb-10">
            <div className="flex items-center bg-white rounded-full p-1.5 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="pl-4 text-slate-400"><Search size={20} /></div>
              <input type="text" placeholder="Cari data statistik atau dokumen..." className="w-full bg-transparent border-none px-4 py-3 text-slate-700 focus:outline-none focus:ring-0" />
              <button className="bg-gradient-to-r from-[#b58500] to-[#805d00] hover:from-[#9c7200] hover:to-[#664a00] text-white p-3 md:px-8 md:py-3 rounded-full font-bold transition-colors">
                <span className="hidden md:inline">Cari</span>
                <Search className="md:hidden" size={20} />
              </button>
            </div>
          </div>

          {/* Stat Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Archive, title: "Total Laporan", value: "1302", sub: "Terselesaikan", date: "HARI INI" },
              { icon: User, title: "Pengguna Aktif", value: "50", sub: "Staf DPKH", date: "SEMESTER GENAP" },
              { icon: FileText, title: "Informasi", value: "30", sub: "Publikasi", date: "" },
              { icon: Monitor, title: "Pendataan", value: "30+", sub: "Terverifikasi", date: "SAAT INI" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="bg-white rounded-[2rem] p-5 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
              >
                <div className="mb-3 bg-gradient-to-b from-[#fdfbf2] to-[#f9f1d8] p-3.5 rounded-2xl group-hover:scale-110 transition-all border border-[#ebd79b]">
                  <stat.icon size={28} className="text-[#b58500]" strokeWidth={2} />
                </div>
                <h3 className="text-[11px] md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b58500] to-[#805d00] mb-1 leading-snug">{stat.title}</h3>
                <p className="text-3xl md:text-[2.75rem] font-black text-slate-800 tracking-tight mb-0.5 leading-none">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-slate-400 mb-3">{stat.sub}</p>
                {stat.date && (
                  <div className="mt-auto w-full pt-3 border-t border-slate-100">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.date}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

const TentangKami = () => {
  return (
    <section id="tentang" className="py-8 md:py-12 bg-white relative w-full border-t border-slate-100">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-4 md:gap-8 mb-8 md:mb-10"
        >
          <div className="h-[2px] bg-gradient-to-r from-transparent to-[#ebd79b] flex-1 max-w-[150px]"></div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 text-center tracking-tight">Tentang SIPNAK</h2>
          <div className="h-[2px] bg-gradient-to-l from-transparent to-[#ebd79b] flex-1 max-w-[150px]"></div>
        </motion.div>

        {/* 1 col di Mobile, 3 cols di Tablet, 5 cols di Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {[
            { icon: Archive, title: "Pengelolaan\nArsip Terpusat", bg: "bg-[#f9f1d8]", border: "border-[#ebd79b]", text: "text-[#b58500]" },
            { icon: Zap, title: "Akses Mudah &\nCepat", bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-500" },
            { icon: ShieldCheck, title: "Keamanan Data\nTerjamin", bg: "bg-emerald-100", border: "border-emerald-200", text: "text-emerald-500" },
            { icon: Monitor, title: "Multi-Perangkat", bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-500" },
            { icon: TrendingUp, title: "Efisiensi\nAdministrasi", bg: "bg-rose-100", border: "border-rose-200", text: "text-rose-500" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white border border-slate-100 p-4 sm:p-5 lg:p-4 xl:p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-row items-center justify-start text-left gap-3 lg:gap-3 xl:gap-4 overflow-hidden"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 ${item.bg} rounded-xl xl:rounded-2xl flex items-center justify-center border ${item.border} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <item.icon className={item.text} size={22} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-slate-800 text-base md:text-lg lg:text-[13px] xl:text-[15px] leading-snug whitespace-pre-line flex-1 min-w-0 break-words">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DocumentCard = ({ doc, onView }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:shadow-[#805d00]/10 transition-all duration-300 flex flex-col h-full relative cursor-pointer group"
      onClick={() => onView(doc)}
    >
      {/* Top Image Thumbnail as Header Background */}
      <div className="relative h-44 overflow-hidden bg-slate-100 border-b border-slate-100">
        <img
          src={doc.thumbnail || 'https://images.unsplash.com/photo-1544816155-12df9643f363'}
          alt="Cover"
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90"
        />
        <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-transparent"></div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider bg-white/95 shadow-sm ${doc.kategori === 'Rahasia' || doc.kategori === 'Sangat Rahasia' ? 'text-red-600 border-red-200' : 'text-emerald-600 border-emerald-200'}`}>
            {doc.kategori === 'Rahasia' || doc.kategori === 'Sangat Rahasia' ? <Lock size={12} /> : <ShieldCheck size={12} />}
            {doc.kategori}
          </span>
        </div>
        <div className="absolute top-3 right-0">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-l-full text-[10px] font-black text-white shadow-md bg-gradient-to-r from-[#b58500] to-[#805d00] uppercase tracking-wider">
            <FileText size={12} />
            {doc.format}
          </span>
        </div>
      </div>

      {/* Content Below Thumbnail */}
      <div className="p-5 flex-1 flex flex-col bg-white">

        {/* Title area */}
        <div className="text-center mb-4">
          <h3 className="font-black text-slate-800 text-lg uppercase leading-tight line-clamp-2">{doc.judul}</h3>
        </div>

        {/* Tags Logic */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <span className="px-2.5 py-1 bg-[#fdfbf2] text-[#805d00] border border-[#ebd79b] rounded-lg text-[10px] sm:text-[11px] font-bold">
            {doc.kodeFolderUtama.split('_').slice(1).join(' ')}
          </span>
          <span className="px-2.5 py-1 bg-[#fdfbf2] text-[#b58500] border border-[#ebd79b]/60 rounded-lg text-[10px] sm:text-[11px] font-semibold">
            {doc.kodeSubFolder.split('_').slice(1).join(' ')}
          </span>
        </div>

        {/* Ringkasan (Keterangan) - Diperbesar agar lebih jelas */}
        <p className="text-slate-600 text-[13px] leading-relaxed line-clamp-2 mb-4 text-center px-1">
          {doc.ringkasan.includes('. ') ? doc.ringkasan.split('. ')[0] + '.' : doc.ringkasan}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-slate-500 mb-4 pb-4 border-b border-slate-100">
          <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#b58500]" /> {(doc.timestamp || '').split(' ')[0]}</span>
          {doc.privasi !== 'Lingkup Prodi' && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-[#b58500]" /> {doc.privasi}</span>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[8px] uppercase tracking-widest font-black text-slate-400">Diunggah Oleh</span>
            <span className="text-[11px] font-bold text-slate-800 truncate">{doc.nama}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onView(doc); }}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg transition-colors flex items-center justify-center"
            >
              <Eye size={16} />
            </button>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 bg-gradient-to-r from-[#b58500] to-[#805d00] hover:from-[#9c7200] hover:to-[#664a00] shadow-md shadow-[#b58500]/20 text-white rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold text-xs"
            >
              <Download size={14} /> <span className="hidden sm:inline">Unduh</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DocumentModal = ({ doc, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && !!doc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-10 pb-20 md:p-6"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-50 max-h-[85vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-red-500 rounded-full text-white transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* Thumbnail Header */}
            <div className="w-full md:w-2/5 relative h-60 md:h-auto bg-slate-100">
              <img src={doc.thumbnail || 'https://images.unsplash.com/photo-1544816155-12df9643f363'} alt={doc.judul} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-3 py-1 bg-gradient-to-r from-[#b58500] to-[#805d00] text-white text-xs font-bold rounded-lg mb-3 inline-block">
                  {doc.format}
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight mb-2">{doc.judul}</h2>
                <p className="text-[#ebd79b] text-sm font-medium flex items-center gap-2">
                  <User size={14} /> {doc.nama}
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="w-full md:w-3/5 flex flex-col bg-white overflow-hidden">
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tanggal Upload</p>
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Calendar size={14} className="text-[#b58500]" /> {(doc.timestamp || '').split(' ')[0]}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tahun Ajaran</p>
                    <p className="text-sm font-semibold text-slate-700">{doc.tahun}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Privasi</p>
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1"><ShieldCheck size={14} className="text-[#b58500]" /> {doc.privasi}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Password</p>
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      {doc.passdok !== '-' ? <><Lock size={14} className="text-red-500" /> Terkunci</> : 'Tidak Ada'}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Tag Kriteria & Indikator</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-[#fdfbf2] text-[#805d00] border border-[#ebd79b] rounded-lg text-xs font-bold">
                      {doc.kodeFolderUtama.split('_').slice(1).join(' ')}
                    </span>
                    <span className="px-3 py-1.5 bg-[#fdfbf2] text-[#b58500] border border-[#ebd79b]/60 rounded-lg text-xs font-semibold">
                      {doc.kodeSubFolder.split('_').slice(1).join(' ')}
                    </span>
                    {doc.indikator.split(',').map((ind, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-medium relative top-px">
                        {ind.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Ringkasan Dokumen</h4>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                    {doc.ringkasan}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-[#b58500] to-[#805d00] hover:from-[#9c7200] hover:to-[#664a00] shadow-[#b58500]/20 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span>Unduh Dokumen Sekarang</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ArsipSection = () => {
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({ folderUtama: [], format: [] });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const optFolderUtama = Array.from(new Set(EXTENDED_DOCS.map(d => d.kodeFolderUtama))).sort();
  const optFormat = Array.from(new Set(EXTENDED_DOCS.map(d => d.format)));

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
    setPage(1);
  };

  const processedDocs = useMemo(() => {
    return EXTENDED_DOCS.filter(doc => {
      const matchFolder = filters.folderUtama.length === 0 || filters.folderUtama.includes(doc.kodeFolderUtama);
      const matchFormat = filters.format.length === 0 || filters.format.includes(doc.format);
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        (doc.judul || '').toLowerCase().includes(searchLower) ||
        (doc.ringkasan || '').toLowerCase().includes(searchLower) ||
        (doc.nama || '').toLowerCase().includes(searchLower) ||
        (doc.kodeFolderUtama || '').toLowerCase().includes(searchLower) ||
        (doc.kodeSubFolder || '').toLowerCase().includes(searchLower) ||
        (doc.indikator || '').toLowerCase().includes(searchLower);
      return matchFolder && matchFormat && matchSearch;
    });
  }, [filters, searchQuery]);

  const itemsPerPage = isMobile ? 4 : (isTablet ? 6 : 8);
  const totalPages = Math.ceil(processedDocs.length / itemsPerPage) || 1;
  const currentDocs = processedDocs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const maxPageVisible = isMobile ? 3 : 5;
  const getPaginationGroup = () => {
    let startPage = Math.max(1, page - Math.floor(maxPageVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxPageVisible - 1);

    if (endPage - startPage + 1 < maxPageVisible) {
      startPage = Math.max(1, endPage - maxPageVisible + 1);
    }
    return new Array(Math.max(0, endPage - startPage + 1)).fill(0).map((_, idx) => startPage + idx);
  };

  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    setPage(newPage);
    const arsipEl = document.getElementById('arsip');
    if (arsipEl) {
      const headerOffset = window.innerWidth < 768 ? 0 : 80;
      const elementPosition = arsipEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const activeFilterCount = filters.folderUtama.length + filters.format.length;

  return (
    <section id="arsip" className="py-10 md:py-12 bg-slate-50 relative w-full min-h-screen">
      <div className="w-full px-4 md:px-8 lg:px-12">

        {/* Header & Filter Box Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              Arsip Dokumen
            </h2>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-20 w-full md:w-auto">

            {/* Search Input */}
            <div className="relative w-full sm:w-64 md:w-80">
              <input
                type="text"
                placeholder="Cari judul, deskripsi, atau nama..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#b58500] pr-10 shadow-sm transition-colors"
              />
              <Search size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex justify-center items-center w-full gap-2 px-5 py-3 rounded-xl border font-semibold transition-all shadow-sm ${isFilterOpen || activeFilterCount > 0
                    ? 'bg-gradient-to-r from-[#b58500] to-[#805d00] border-[#805d00] text-white shadow-[#b58500]/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-[#b58500] hover:text-[#9c7200]'
                  }`}
              >
                <Filter size={18} />
                <span>Filter Dokumen</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-white text-[#b58500] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Filter Dropdown/Popup - Reworked to Grid 4 layout */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-[340px] sm:w-[380px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-50 p-4 sm:p-5 max-h-[80vh] overflow-y-auto"
                  >
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {/* Section: Kriteria Akreditasi / Folder Utama */}
                      {optFolderUtama.map(folder => {
                        const isActive = filters.folderUtama.includes(folder);
                        const mapped = MASTER_FOLDER_IAPS.find(m => m.kodeFolderUtama === folder);
                        const labelName = mapped ? mapped.namaKriteria : folder.split('_').slice(1).join(' ');
                        return (
                          <button
                            key={folder}
                            onClick={() => toggleFilter('folderUtama', folder)}
                            className={`col-span-2 flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all shadow-sm gap-1.5 sm:gap-2 ${isActive ? 'bg-gradient-to-b from-[#fdfbf2] to-[#f9f1d8] border-[#ebd79b] text-[#805d00] ring-1 ring-[#ebd79b]/50' : 'bg-white border-slate-200 text-slate-500 hover:border-[#ebd79b] hover:bg-slate-50'}`}
                          >
                            <Book size={22} className={isActive ? 'text-[#b58500]' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[11px] font-bold text-center leading-tight">{labelName}</span>
                          </button>
                        );
                      })}

                      {/* Section: Jenis Format */}
                      {optFormat.map(f => {
                        const isActive = filters.format.includes(f);
                        const Icon = f === 'PDF' ? FileText : (f === 'XLS' ? LayoutGrid : Archive);
                        return (
                          <button
                            key={f}
                            onClick={() => toggleFilter('format', f)}
                            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all shadow-sm gap-1.5 sm:gap-2 ${isActive ? 'bg-gradient-to-b from-[#fdfbf2] to-[#f9f1d8] border-[#ebd79b] text-[#805d00] ring-1 ring-[#ebd79b]/50' : 'bg-white border-slate-200 text-slate-500 hover:border-[#ebd79b] hover:bg-slate-50'}`}
                          >
                            <Icon size={22} className={isActive ? 'text-[#b58500]' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold text-center leading-tight whitespace-nowrap">{f}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Reset Button */}
                    {(filters.folderUtama.length > 0 || filters.format.length > 0) && (
                      <button onClick={() => setFilters({ folderUtama: [], format: [] })} className="w-full mt-4 text-sm text-red-600 font-bold hover:bg-red-50 py-3 rounded-xl border border-red-100 transition-colors">
                        Hapus Semua Filter
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentDocs.length > 0 ? currentDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <DocumentCard doc={doc} onView={setSelectedDoc} />
              </motion.div>
            )) : (
              <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-full flex flex-col items-center justify-center text-slate-400 py-20">
                <Search size={48} className="mb-4 text-slate-300" />
                <p className="text-lg font-semibold">Tidak ada dokumen yang sesuai dengan filter.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Kotak Pagination ditaruh di bawah */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-8 md:mb-0">
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
              <button
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${page === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <ChevronLeft size={20} />
              </button>

              {getPaginationGroup().map(num => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`relative w-10 h-10 rounded-lg font-bold text-sm transition-all ${page === num ? 'bg-gradient-to-r from-[#b58500] to-[#805d00] text-white shadow-md shadow-[#b58500]/30' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${page === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <DocumentModal doc={selectedDoc} isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} />
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 pt-16 pb-24 md:pb-12 border-t-4 border-[#b58500]">
    <div className="w-full px-6 md:px-12 lg:px-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
            <img src="https://black-ernesta-5.tiiny.site/2023-09-25-044131-264403Logo-kabupaten-Bangkalan.svg" alt="SIPNAK Logo" className="w-8 h-8" />
            <span className="text-3xl font-extrabold tracking-tight text-white">SIPNAK</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Copyright &copy; 2026 All Rights Reserved.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://youtube.com/@arsipagrinak" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 group border border-red-500/30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:animate-pulse"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            <span className="font-bold text-sm">YouTube</span>
          </a>
          <a href="https://instagram.com/arsipagrinak" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d6249f]/20 hover:bg-gradient-to-tr hover:from-[#fd5949] hover:to-[#d6249f] text-white transition-all duration-300 hover:scale-105 group border border-[#d6249f]/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span className="font-bold text-sm">Instagram</span>
          </a>
          <a href="https://wa.me/6285179852558" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500 text-white transition-all duration-300 hover:scale-105 group border border-green-500/30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
            <span className="font-bold text-sm">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN APP ---
const App = () => {
  const [currentSection, setCurrentSection] = useState('beranda');
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Track scroll sections
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['beranda', 'tentang', 'arsip'];
      const scrollY = window.scrollY;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 200;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setCurrentSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (user) {
    return (
      <LoginDashboard
        initialUser={user}
        initialView="dashboard"
        onLogout={() => {
          setUser(null);
          window.location.hash = '#beranda';
        }}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 overflow-x-hidden w-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Menggunakan `<style>` normal secara aman untuk mencegah crash render */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        ::-webkit-scrollbar, .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track, .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        ::-webkit-scrollbar-thumb, .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #b58500, #805d00);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover, .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #d4a31a, #9c7200);
        }
        
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .pb-safe { padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem); }
        }
      `}</style>

      <Header currentSection={currentSection} setCurrentSection={setCurrentSection} onLoginClick={() => setShowLoginModal(true)} />
      <Hero />
      <TentangKami />
      <ArsipSection />
      <Footer />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={(loggedInUser) => { setUser(loggedInUser); setShowLoginModal(false); }} />
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIdentifier('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = INITIAL_USERS.find(
      (u) => (u.nip === identifier || u.email === identifier) && u.password === password
    );
    if (found) {
      if (found.status !== 'Aktif') {
        setError('Akun Anda dinonaktifkan/pensiun.');
        return;
      }
      onLoginSuccess(found);
    } else {
      setError('NIP/Email atau Password salah!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 z-50 border border-slate-100 flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <img
                src="https://black-ernesta-5.tiiny.site/2023-09-25-044131-264403Logo-kabupaten-Bangkalan.svg"
                alt="Bangkalan Logo"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Login SIPNAK</h2>
              <p className="text-slate-500 text-xs mt-1">Sistem Informasi dan Arsip Peternakan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  NIP / Email Account
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    required
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#b58500] focus:border-transparent block pl-10 p-3.5 transition-all outline-none"
                    placeholder="Masukkan NIP atau Email..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-[#b58500] focus:border-transparent block pl-10 p-3.5 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Lock size={14} className="text-red-500" />
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#b58500] to-[#805d00] hover:from-[#d4a31a] hover:to-[#9c7200] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#b58500]/30 transition-all transform active:scale-95 flex justify-center items-center gap-2 mt-4"
              >
                <LogIn size={20} /> Masuk Sistem
              </button>
            </form>

            <div className="mt-6 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 font-medium">Test Accounts:</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                NIP: 2982019 (Ultimate) | NIP: 1987654321001 (SuperAdmin)<br />
                Pass: ultimate123 / superadmin123
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;
