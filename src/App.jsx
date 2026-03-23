
import React, { useState, useEffect } from 'react';
import { Leaf, Camera, BookOpen, PenTool, Calendar, Award, Users, ChevronRight, CheckCircle, MapPin, Mail, Phone, ExternalLink, Menu, X, Lock, Download, Info, Clock, AlertCircle } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
// ==========================================
// ✅ KONFIGURASI FIREBASE ASLI (TIDAK DIUBAH)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyB0xaaIaOhPZ9uAs96qo_uxefJot0YUDo0",
  authDomain: "cpf-2026.firebaseapp.com",
  projectId: "cpf-2026",
  storageBucket: "cpf-2026.firebasestorage.app",
  messagingSenderId: "231334572462",
  appId: "1:231334572462:web:96716d477eacaae56ed83f"
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Init Error:", error);
}

const COLLECTION_NAME = "pendaftaran_epic_2026";

// --- DATA LOMBA EPIC ---
const COMPETITION_DATA = [
  {
    id: 'lkti',
    title: "LKTI Nasional EPIC",
    icon: BookOpen,
    target: "Mahasiswa S1/D3/D4",
    shortDesc: "Kompetisi karya tulis ilmiah inovatif seputar teknologi perlindungan tanaman.",
    theme: "Transformasi Sistem Perlindungan Tanaman Berbasis Ekologi",
    subThemes: [
      "Digitalisasi Biosekuriti untuk Pencegahan OPT pada Tanaman Budidaya",
      "Pengendalian Hama Berbasis Data dan Ekosistem",
      "Formulasi Biopestisida dan Pestisida Nabati"
    ],
    timeline: [
      "Pendaftaran & Abstrak: 25 Mar - 9 Apr 2026",
      "Penjurian: 16 - 20 Apr 2026",
      "Grand Final: 26 Apr 2026"
    ],
    price: "Rp 150.000 / Tim",
    color: "bg-blue-500 text-blue-500",
    bgLight: "bg-blue-50"
  },
  {
    id: 'essay',
    title: "Essay Competition",
    icon: PenTool,
    target: "Siswa SMA/Sederajat",
    shortDesc: "Tuangkan gagasan kritis dan solutifmu tentang masa depan pertanian Indonesia.",
    theme: "Akselerasi Gen-Z : Menjawab Tantangan Pangan Nasional",
    subThemes: [
      "Inovasi Kebun Vertikal dan Hidroponik Cerdas",
      "Implementasi IoT untuk Deteksi Dini Hama",
      "Rekayasa Bioekologi Tahan Iklim"
    ],
    timeline: [
      "Pendaftaran & Abstrak: 25 Mar - 9 Apr 2026",
      "Penjurian: 16 - 20 Apr 2026",
      "Grand Final: 26 Apr 2026"
    ],
    price: "Rp 85.000 / Tim",
    color: "bg-yellow-500 text-yellow-600",
    bgLight: "bg-yellow-50"
  },
  {
    id: 'foto',
    title: "Fotografi Pertanian",
    icon: Camera,
    target: "Umum (Mahasiswa/SMA)",
    shortDesc: "Abadikan momen perlindungan tanaman dan ekosistem pertanian dalam lensa.",
    theme: "The Art of Resilience : Keindahan Ilmiah Perlindungan Tanaman",
    subThemes: [
      "Pest in Action : Serangga Hama",
      "Predasi Musuh Alami",
      "Peran Polinator dalam Pertanian"
    ],
    timeline: [
      "Upload Karya: 25 Mar - 9 Apr 2026",
      "Penjurian: 16 - 20 Apr 2026",
      "Pengumuman: 26 Apr 2026"
    ],
    price: "Rp 85.000 / Orang",
    color: "bg-purple-500 text-purple-500",
    bgLight: "bg-purple-50"
  }
];

// ==========================================
// VIEW: TENTANG EPIC (MENU BARU)
// ==========================================
const ViewTentang = () => (
  <div className="pb-24 md:pb-6 space-y-6">
    <div className="mb-8">
      <h1 className="text-3xl font-black text-gray-900">Tentang EPIC 2026</h1>
      <p className="text-gray-500">Mengenal lebih dekat inovasi perlindungan tanaman.</p>
    </div>

    <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 opacity-10">
        <Leaf size={200} />
      </div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Visi & Skala Kompetisi</h2>
        <p className="text-emerald-50 leading-relaxed mb-6">
          EPIC (Excellent Plant Protection Innovation Competition) hadir sebagai panggung utama bagi generasi muda Indonesia untuk menuangkan gagasan solutif dan inovatif. Kami mengundang seluruh agen perubahan untuk berkontribusi nyata memajukan sektor pertanian yang presisi dan berkelanjutan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-white/10 p-4 rounded-xl flex-1 border border-white/20 backdrop-blur-sm">
            <h3 className="font-bold text-yellow-400 text-lg mb-1 flex items-center gap-2"><MapPin size={16}/> Tingkat Nasional</h3>
            <p className="text-xs text-emerald-100">Menjangkau mahasiswa dan siswa SMA/sederajat dari seluruh penjuru perguruan tinggi dan sekolah di Indonesia.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl flex-1 border border-white/20 backdrop-blur-sm">
            <h3 className="font-bold text-blue-400 text-lg mb-1 flex items-center gap-2"><Award size={16}/> 3 Kategori Lomba</h3>
            <p className="text-xs text-emerald-100">Menantang kemampuan analisis, literasi, dan kreativitas visual melalui LKTI, Essay, dan Fotografi Pertanian.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="text-yellow-500" /> Tujuan Utama
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Mewadahi inovasi mahasiswa dan pelajar tingkat nasional di bidang perlindungan tanaman.</li>
          <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Memperkenalkan eksistensi dan peran HIMASITA UNSOED kepada masyarakat luas.</li>
          <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Mewujudkan pengabdian masyarakat nyata melalui program ABDISITA di bulan Ramadhan.</li>
        </ul>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="text-blue-500" /> Penyelenggara
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Diselenggarakan sepenuhnya oleh <strong>Himpunan Mahasiswa Proteksi Tanaman (HIMASITA)</strong> Universitas Jenderal Soedirman.
        </p>
        <div className="flex gap-4 mt-auto">
          <div className="flex flex-col items-center">
            <img src="/logo-himasita.png" alt="HIMASITA" className="h-16 w-16 object-contain bg-gray-50 rounded-xl p-2 border border-gray-200" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
            <div className="hidden h-16 w-16 bg-gray-100 rounded-xl items-center justify-center text-xs font-bold text-gray-400 border border-gray-200">HMT</div>
            <span className="text-[10px] font-bold text-gray-500 mt-2">HIMASITA</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/logo-epic.png" alt="EPIC" className="h-16 w-16 object-contain bg-gray-50 rounded-xl p-2 border border-gray-200" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
            <div className="hidden h-16 w-16 bg-yellow-100 rounded-xl items-center justify-center text-xs font-bold text-yellow-600 border border-yellow-200">EPIC</div>
            <span className="text-[10px] font-bold text-gray-500 mt-2">EPIC 2026</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// VIEW: HOME (DASHBOARD WELCOME)
// ==========================================
const ViewHome = ({ setActiveTab }) => (
  <div className="space-y-6 pb-24 md:pb-6">
    <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
      <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12">
        <Leaf size={250} className="text-emerald-300" />
      </div>
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-xs font-bold uppercase mb-4">
          <Award size={14} className="text-yellow-400" /> Dies Natalis HIMASITA ke-1
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
          EPIC <span className="text-yellow-400">2026</span>
        </h1>
        <h2 className="text-xl md:text-2xl text-emerald-100 font-light mb-8 max-w-2xl">
          Excellent Plant Protection Innovation Competition
        </h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setActiveTab('daftar')} className="bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center">
            Daftar Sekarang <ChevronRight size={18} className="ml-1" />
          </button>
          <button onClick={() => setActiveTab('lomba')} className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all border border-white/20 flex items-center">
            Lihat Kategori Lomba
          </button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="text-emerald-600" /> Timeline Penting EPIC
        </h3>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
          {[
            { date: "25 Mar - 9 Apr", event: "Pendaftaran & Pengumpulan Karya" },
            { date: "16 - 20 Apr", event: "Tahap Penjurian" },
            { date: "26 Apr 2026", event: "Grand Final & Awarding" }
          ].map((item, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <CheckCircle size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 shadow-sm bg-gray-50">
                <div className="flex flex-col">
                  <span className="font-bold text-emerald-700 text-sm">{item.date}</span>
                  <span className="text-gray-800 font-medium">{item.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-8 shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={100} /></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Total Hadiah</h3>
          <p className="text-sm text-emerald-200 mb-6">Jutaan Rupiah + Sertifikat + Relasi Nasional</p>
          
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-yellow-400">3</div>
              <div className="text-sm text-emerald-100">Kategori Lomba</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-yellow-400">Nasional</div>
              <div className="text-sm text-emerald-100">Tingkat Kompetisi</div>
            </div>
          </div>
        </div>
        <button onClick={() => setActiveTab('daftar')} className="mt-8 w-full bg-white text-emerald-900 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors z-10 relative">
          Daftar Sekarang
        </button>
      </div>
    </div>
  </div>
);

// ==========================================
// VIEW: LOMBA (KATALOG)
// ==========================================
const ViewLomba = ({ setActiveTab }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="pb-24 md:pb-6 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Kategori Lomba EPIC</h1>
        <p className="text-gray-500">Pilih cabang kompetisi dan tunjukkan inovasi terbaikmu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COMPETITION_DATA.map((lomba) => (
          <div key={lomba.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${lomba.bgLight} ${lomba.color.split(' ')[1]} flex items-center justify-center mb-6`}>
              <lomba.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{lomba.title}</h3>
            <div className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
              {lomba.target}
            </div>
            <p className="text-sm text-gray-600 mb-8 flex-grow">{lomba.shortDesc}</p>
            
            <div className="flex gap-3 mt-auto">
              <button 
                onClick={() => setSelected(lomba)} 
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-emerald-700 font-bold py-3 rounded-xl border border-gray-200 transition-colors text-sm"
              >
                Detail
              </button>
              <button 
                onClick={() => setActiveTab('daftar')} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm"
              >
                Daftar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className={`${selected.bgLight} p-6 md:p-8 flex items-start justify-between relative`}>
                <div className="flex gap-4 items-center">
                  <div className={`p-4 rounded-2xl bg-white shadow-sm ${selected.color.split(' ')[1]}`}>
                    <selected.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{selected.title}</h3>
                    <p className={`font-semibold ${selected.color.split(' ')[1]}`}>{selected.price}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-white flex-grow">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tema Utama</h4>
                  <p className="text-lg font-bold text-emerald-900 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    "{selected.theme}"
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Sub Tema</h4>
                    <ul className="space-y-2">
                      {selected.subThemes.map((sub, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <CheckCircle size={16} className="text-emerald-500 mr-2 shrink-0 mt-0.5" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Timeline Lomba</h4>
                    <ul className="space-y-3">
                      {selected.timeline.map((time, i) => {
                        const parts = time.split(':');
                        return (
                          <li key={i} className="text-sm border-l-2 border-emerald-200 pl-3">
                            <div className="font-semibold text-gray-900">{parts[0]}</div>
                            <div className="text-gray-500">{parts[1]}</div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                <a href="https://drive.google.com/file/d/1K6Wxe2eUqa1mSP34-9yTPn4jCG5ztfSM/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-colors">
                  <Download size={18} /> Panduan PDF
                </a>
                <button onClick={() => { setSelected(null); setActiveTab('daftar'); }} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors">
                  Daftar Sekarang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// VIEW: PENDAFTARAN (FORM)
// ==========================================
const ViewDaftar = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lomba, setLomba] = useState('LKTI');
  
  const [formData, setFormData] = useState({
    teamName: '', leaderName: '', email: '', phone: '', institution: '', driveLink: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert("Menunggu koneksi ke server..."); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...formData,
        category: lomba,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setSuccess(true);
      setFormData({ teamName: '', leaderName: '', email: '', phone: '', institution: '', driveLink: '' });
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Gagal mengirim data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex items-center justify-center pb-24 md:pb-0">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-6 animate-pulse">
            <CheckCircle className="h-14 w-14 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Berhasil!</h2>
          <p className="text-gray-500 mb-8">
            Pendaftaran <b>{formData.teamName || "Peserta"}</b> untuk kompetisi {lomba} telah tersimpan.
          </p>
          <button onClick={() => setSuccess(false)} className="w-full bg-emerald-50 text-emerald-800 py-3 rounded-xl font-bold hover:bg-emerald-100 transition-colors">
            Daftar Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Form Pendaftaran EPIC</h1>
        <p className="text-gray-500">Lengkapi data diri dan tim dengan benar.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Kategori Kompetisi</label>
            <div className="grid grid-cols-3 gap-3">
              {['LKTI', 'Essay', 'Fotografi'].map((type) => (
                <button
                  key={type} type="button" onClick={() => setLomba(type)}
                  className={`py-3 px-2 text-sm md:text-base font-bold rounded-xl border-2 transition-all ${
                    lomba === type ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Tim / Karya</label>
              <input required type="text" name="teamName" value={formData.teamName} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={lomba === 'LKTI' ? "Contoh: Tim Inovasi" : "Judul / Nama"} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap Ketua / Peserta</label>
              <input required type="text" name="leaderName" value={formData.leaderName} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Nama Lengkap" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Instansi / Asal Sekolah</label>
              <input required type="text" name="institution" value={formData.institution} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="UNSOED / SMA N 1..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp Aktif</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Aktif</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="email@example.com" />
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <label className="block text-base font-bold text-blue-900 mb-2 flex items-center">
              <ExternalLink size={18} className="mr-2" /> Link Folder Google Drive
            </label>
            <p className="text-sm text-blue-700 mb-4">
              Jadikan folder <strong>"Anyone with link"</strong>. Isi folder: Karya, Identitas (KTM/Kartu Pelajar), dan Bukti Pembayaran.
            </p>
            <input required type="url" name="driveLink" value={formData.driveLink} onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://drive.google.com/drive/folders/..." />
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-4 rounded-xl text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Menyimpan...' : 'Kirim Pendaftaran'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// VIEW: ADMIN PANEL
// ==========================================
const ViewAdmin = ({ user }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'epic2026') { 
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Password salah!');
    }
  };

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center pb-24 md:pb-0">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Admin EPIC</h2>
            <p className="text-gray-500 text-sm mt-1">Area khusus panitia inti</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-center"
              placeholder="Masukkan Password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}
            <button type="submit" className="w-full bg-emerald-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-950 transition-colors">
              Masuk Dashboard
            </button>
            <p className="text-[10px] text-center text-gray-400">Gunakan: epic2026</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard Pendaftar</h1>
          <p className="text-gray-500">Rekap data peserta EPIC 2026</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 shadow-sm text-sm">
          Keluar Admin
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>
      ) : submissions.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Belum ada data pendaftar.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-3xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Tanggal', 'Lomba', 'Peserta/Tim', 'Instansi', 'Kontak', 'Aksi'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sub.createdAt ? new Date(sub.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day:'numeric', month:'short'}) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-md 
                        ${sub.category === 'LKTI' ? 'bg-blue-50 text-blue-700' : sub.category === 'Essay' ? 'bg-yellow-50 text-yellow-700' : 'bg-purple-50 text-purple-700'}`}>
                        {sub.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{sub.teamName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{sub.leaderName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.institution}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center"><Phone className="w-3 h-3 mr-1"/> {sub.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={sub.driveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                        Buka Folder <ExternalLink className="w-3 h-3 ml-1.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ROOT APP COMPONENT (DASHBOARD LAYOUT)
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  // Authentication
  useEffect(() => {
    const initAuth = async () => {
      if (auth) {
        try { await signInAnonymously(auth); } 
        catch (error) { console.error("Auth error:", error); }
      }
    };
    initAuth();
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    }
  }, []);

  // Menu Configuration 
  const NAV_MENU = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'tentang', label: 'Tentang EPIC', icon: Info },
    { id: 'lomba', label: 'Kategori Lomba', icon: LayoutGrid },
    { id: 'daftar', label: 'Pendaftaran', icon: FileText },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ];

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex overflow-hidden">
      
      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-72 bg-emerald-950 text-white h-screen fixed left-0 top-0 shadow-2xl z-50">
        <div className="p-8 pb-4 border-b border-emerald-900">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-epic.png" alt="EPIC" className="h-12 w-auto object-contain bg-white rounded-lg p-1.5 shadow-md" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="hidden h-12 w-12 bg-yellow-400 rounded-lg items-center justify-center text-emerald-900 font-black text-sm shadow-md">EPIC</div>
            
            <div className="w-px h-8 bg-emerald-800 mx-1"></div> 
            
            <img src="/logo-himasita.png" alt="HIMASITA" className="h-12 w-auto object-contain bg-white rounded-lg p-1.5 shadow-md" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="hidden h-12 w-12 bg-emerald-800 rounded-lg items-center justify-center text-emerald-100 font-bold text-xs shadow-md border border-emerald-700">HMT</div>
          </div>
          
          <h1 className="text-2xl font-black tracking-tight text-white mt-2">EPIC 2026</h1>
          <p className="text-emerald-400 text-[10px] tracking-widest uppercase font-bold mt-1">HIMASITA UNSOED</p>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-1.5 overflow-y-auto">
          {NAV_MENU.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                activeTab === menu.id 
                ? 'bg-emerald-800 text-white shadow-inner' 
                : 'text-emerald-400 hover:bg-emerald-900 hover:text-emerald-100'
              }`}
            >
              <menu.icon size={20} className={activeTab === menu.id ? 'text-yellow-400' : ''} />
              {menu.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-emerald-900">
          <div className="bg-emerald-900/50 p-4 rounded-2xl text-xs text-emerald-300 text-center border border-emerald-800/50">
            Support by <br/><span className="text-white font-bold text-sm">HIMASITA Kabinet 2026</span>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP HEADER */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-emerald-950 text-white p-3 flex justify-between items-center z-40 shadow-md">
         <div className="flex items-center gap-2">
            <img src="/logo-epic.png" alt="EPIC" className="h-8 w-auto object-contain bg-white rounded-md p-1" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="hidden h-8 w-8 bg-yellow-400 rounded-md items-center justify-center text-emerald-900 font-black text-[10px]">EPC</div>
            
            <img src="/logo-himasita.png" alt="HIMASITA" className="h-8 w-auto object-contain bg-white rounded-md p-1" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="hidden h-8 w-8 bg-emerald-800 rounded-md items-center justify-center text-emerald-100 font-bold text-[10px] border border-emerald-700">HMT</div>
         </div>
         <h1 className="font-black text-lg tracking-widest text-emerald-50">EPIC 2026</h1>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto md:ml-72 relative scroll-smooth pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-10 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === 'home' && <ViewHome setActiveTab={setActiveTab} />}
              {activeTab === 'tentang' && <ViewTentang />}
              {activeTab === 'lomba' && <ViewLomba setActiveTab={setActiveTab} />}
              {activeTab === 'daftar' && <ViewDaftar user={user} />}
              {activeTab === 'admin' && <ViewAdmin user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION (APP STYLE) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center p-2 z-50 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {NAV_MENU.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveTab(menu.id)}
            className={`flex flex-col items-center justify-center w-full py-2 ${
              activeTab === menu.id ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-full mb-1 transition-colors ${activeTab === menu.id ? 'bg-emerald-100' : ''}`}>
              <menu.icon size={20} />
            </div>
            <span className={`text-[10px] font-bold ${activeTab === menu.id ? 'text-emerald-700' : ''}`}>
              {menu.label}
            </span>
          </button>
        ))}
      </nav>

    </div>
  );
}
