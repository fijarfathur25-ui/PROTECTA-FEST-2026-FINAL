import React, { useState, useEffect } from 'react';
import { Leaf, Camera, BookOpen, PenTool, Calendar, Award, Users, ChevronRight, CheckCircle, MapPin, Mail, Phone, ExternalLink, Menu, X, Lock, Download, Info, Clock, AlertCircle } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';

// ==========================================
// ✅ KONFIGURASI FIREBASE ASLI
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyB0xaaIaOhPZ9uAs96qo_uxefJot0YUDo0",
  authDomain: "cpf-2026.firebaseapp.com",
  projectId: "cpf-2026",
  storageBucket: "cpf-2026.firebasestorage.app",
  messagingSenderId: "231334572462",
  appId: "1:231334572462:web:96716d477eacaae56ed83f"
};

// Inisialisasi Firebase
// Note: Menggunakan try-catch agar preview tidak crash jika config bermasalah
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Init Error:", error);
}

// Nama Koleksi Database
const COLLECTION_NAME = "pendaftaran_cpf_2026";

// --- DATA LOMBA ---
const COMPETITION_DATA = [
  {
    id: 'lkti',
    title: "LKTI Nasional",
    icon: BookOpen,
    target: "Mahasiswa S1/D3/D4",
    shortDesc: "Kompetisi karya tulis ilmiah inovatif seputar teknologi perlindungan tanaman.",
    fullDesc: "Lomba Karya Tulis Ilmiah (LKTI) tingkat nasional ini mewadahi mahasiswa untuk menuangkan ide kreatif dan inovatif berbasis riset atau tinjauan pustaka dalam mengatasi permasalahan hama dan penyakit tumbuhan.",
    theme: "Inovasi Teknologi Perlindungan Tanaman di Era Society 5.0",
    subThemes: [
      "Pemanfaatan Agens Hayati",
      "IoT dan AI dalam Monitoring Hama",
      "Bioteknologi Pertanian",
      "Pertanian Presisi Ramah Lingkungan"
    ],
    timeline: [
      "Pendaftaran & Abstrak: 1 Jan - 20 Feb 2026",
      "Pengumuman Abstrak: 25 Feb 2026",
      "Pengumpulan Full Paper: 26 Feb - 20 Mar 2026",
      "Grand Final (Presentasi): 20 April 2026"
    ],
    price: "Rp 150.000 / Tim",
    color: "bg-blue-500",
    guidebookLink: "#"
  },
  {
    id: 'essay',
    title: "Essay Competition",
    icon: PenTool,
    target: "Siswa SMA/Sederajat",
    shortDesc: "Tuangkan gagasan kritis dan solutifmu tentang masa depan pertanian Indonesia.",
    fullDesc: "Kompetisi Esai Nasional untuk siswa SMA/sederajat yang bertujuan melatih kemampuan berpikir kritis dan menulis argumentatif mengenai isu ketahanan pangan nasional.",
    theme: "Peran Gen-Z dalam Menjaga Ketahanan Pangan Nasional",
    subThemes: [
      "Urban Farming Solusi Lahan Sempit",
      "Regenerasi Petani Muda",
      "Pangan Lokal vs Pangan Impor"
    ],
    timeline: [
      "Pendaftaran & Pengumpulan: 10 Jan - 15 Mar 2026",
      "Penjurian: 16 - 30 Mar 2026",
      "Pengumuman Pemenang: 20 April 2026"
    ],
    price: "Rp 50.000 / Orang",
    color: "bg-yellow-500",
    guidebookLink: "#"
  },
  {
    id: 'foto',
    title: "Fotografi Pertanian",
    icon: Camera,
    target: "Umum (Mahasiswa/SMA)",
    shortDesc: "Abadikan momen perlindungan tanaman dan ekosistem pertanian dalam lensa.",
    fullDesc: "Lomba fotografi yang mengangkat sisi estetika, human interest, dan teknis dari kegiatan pertanian, khususnya aspek perlindungan tanaman dari hama dan penyakit.",
    theme: "Harmoni Alam dan Manusia dalam Pertanian",
    subThemes: [
      "Aktivitas Petani di Lahan",
      "Detail Hama atau Musuh Alami (Makro)",
      "Lansekap Pertanian Berkelanjutan"
    ],
    timeline: [
      "Upload Karya: 1 Jan - 10 April 2026",
      "Penjurian & Vote Likes: 11 - 18 April 2026",
      "Pameran & Pengumuman: 20 April 2026"
    ],
    price: "Rp 75.000 / Orang",
    color: "bg-purple-500",
    guidebookLink: "#"
  }
];

// --- COMPONENTS ---

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-emerald-900/95 backdrop-blur-md text-white shadow-lg border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-white p-1.5 rounded-full mr-2">
              <Leaf className="h-6 w-6 text-emerald-700" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-wider leading-none">CPF 2026</span>
              <span className="text-[10px] text-emerald-300 tracking-widest">HIMASITA UNSOED</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {['Home', 'Lomba', 'Daftar', 'Admin'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.toLowerCase()
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-emerald-100 hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-emerald-800 px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-emerald-700 shadow-xl">
          {['Home', 'Lomba', 'Daftar', 'Admin'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveTab(item.toLowerCase());
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === item.toLowerCase() ? 'bg-emerald-900 text-white' : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = ({ setActiveTab }) => (
  <div className="relative bg-emerald-900 text-white overflow-hidden min-h-[85vh] flex flex-col justify-center">
    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center" />
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 via-emerald-900/20 to-emerald-900" />
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
      <div className="animate-fade-in-up">
        <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-emerald-800/80 border border-emerald-600 text-emerald-100 text-sm font-semibold mb-6 backdrop-blur-sm">
          <Award className="w-4 h-4 text-yellow-400" />
          Dies Natalis HIMASITA UNSOED ke-1
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-lg">
          CROP PROTECTION <br/> FEST <span className="text-yellow-400">2026</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl md:text-2xl text-emerald-50 font-light leading-relaxed">
          "Inovasi Generasi Muda dalam Mewujudkan Pertanian Berkelanjutan Melalui Perlindungan Tanaman"
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setActiveTab('daftar')}
            className="px-8 py-4 bg-yellow-400 text-emerald-900 text-lg font-bold rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
          >
            Daftar Sekarang <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('lomba')}
            className="px-8 py-4 border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            Panduan Lomba <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Timeline = () => (
  <div className="py-16 bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-emerald-900">Rangkaian Kegiatan</h2>
        <div className="w-20 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {[
            { date: "Jan - Mar 2026", title: "Pendaftaran", desc: "Registrasi & Pengumpulan", icon: Calendar },
            { date: "April 2026", title: "Penjurian", desc: "Seleksi Karya Terbaik", icon: Users },
            { date: "15 April 2026", title: "Pengumuman", desc: "Rilis Finalis 10 Besar", icon: AlertCircle },
            { date: "20 April 2026", title: "Awarding Night", desc: "Puncak Dies Natalis", icon: Award },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg text-center md:hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-sm">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-yellow-600 mb-1 uppercase tracking-wide">{item.date}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DetailModal = ({ item, onClose }) => (
  <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={onClose}></div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
        <div className={`h-3 w-full ${item.color}`}></div>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${item.color.replace('bg-', 'bg-').replace('500', '100')} sm:mx-0 sm:h-10 sm:w-10`}>
              <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-').replace('500', '600')}`} />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-2xl leading-6 font-bold text-gray-900">
                {item.title}
              </h3>
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-bold text-gray-400 uppercase">Tema</span>
                  <p className="text-lg font-medium text-emerald-800">{item.theme}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center"><Leaf className="w-4 h-4 mr-2 text-emerald-500"/> Sub-Tema</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-1">
                    {item.subThemes.map((sub, idx) => (
                      <li key={idx}>{sub}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center"><Clock className="w-4 h-4 mr-2 text-emerald-500"/> Timeline Penting</h4>
                  <ul className="space-y-2">
                    {item.timeline.map((time, idx) => (
                      <li key={idx} className="text-sm flex justify-between border-b border-gray-100 pb-1">
                        <span className="text-gray-600">{time.split(':')[0]}</span>
                        <span className="font-semibold text-gray-900">{time.split(':')[1]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                   <div>
                     <span className="text-xs text-emerald-600 font-bold uppercase">Biaya Pendaftaran</span>
                     <div className="text-xl font-bold text-emerald-800">{item.price}</div>
                   </div>
                   <button className="text-sm text-emerald-700 font-semibold underline hover:text-emerald-900">
                     Download Panduan Lengkap PDF
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Competitions = ({ setActiveTab }) => {
  const [selectedLomba, setSelectedLomba] = useState(null);

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">Kategori Lomba</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Tunjukkan Karyamu
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Pilih kategori yang sesuai dan menangkan total hadiah jutaan rupiah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COMPETITION_DATA.map((lomba) => (
            <div key={lomba.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
              <div className={`h-2 w-full ${lomba.color}`} />
              <div className="p-8 flex-grow flex flex-col">
                <div className={`inline-flex p-3 rounded-lg ${lomba.color.replace('bg-', 'bg-').replace('500', '100')} ${lomba.color.replace('bg-', 'text-').replace('500', '700')} mb-4 w-fit`}>
                  <lomba.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{lomba.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4 font-medium bg-gray-100 py-1 px-3 rounded-full w-fit">
                  <Users className="h-3 w-3 mr-2" />
                  {lomba.target}
                </div>
                <p className="text-gray-600 mb-6 flex-grow">{lomba.shortDesc}</p>
                
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-4">
                     <div>
                        <span className="text-xs text-gray-400 uppercase font-bold">Biaya</span>
                        <div className="text-lg font-bold text-emerald-600">{lomba.price}</div>
                     </div>
                  </div>
                  <button 
                    onClick={() => setSelectedLomba(lomba)}
                    className="w-full py-3 border border-emerald-200 text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors mb-3 flex justify-center items-center"
                  >
                    <Info className="w-4 h-4 mr-2" /> Detail & Aturan
                  </button>
                  <button 
                    onClick={() => setActiveTab('daftar')}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedLomba && <DetailModal item={selectedLomba} onClose={() => setSelectedLomba(null)} />}
    </div>
  );
};

const SubmissionForm = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lomba, setLomba] = useState('LKTI');
  
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    email: '',
    phone: '',
    institution: '',
    driveLink: ''
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
      alert("Gagal mengirim data. Pastikan koneksi internet lancar.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-emerald-50">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-t-8 border-emerald-500">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Pendaftaran tim <b>{formData.teamName || "Anda"}</b> telah kami terima. Silakan cek email secara berkala.
          </p>
          <button onClick={() => setSuccess(false)} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
            Kembali ke Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-emerald-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
          <div className="bg-emerald-900 py-8 px-8 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white">Formulir Pendaftaran</h2>
              <p className="text-emerald-200 mt-2">Pastikan data yang diisi valid dan sesuai identitas.</p>
            </div>
            <Leaf className="text-emerald-800 w-32 h-32 absolute -right-6 -bottom-6 opacity-50 rotate-45" />
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Pilih Kategori</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['LKTI', 'Essay', 'Fotografi'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLomba(type)}
                    className={`py-4 px-4 text-base font-bold rounded-xl border-2 focus:outline-none transition-all ${
                      lomba === type
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md transform scale-105'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Tim / Peserta</label>
                  <input
                    required
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                    placeholder={lomba === 'LKTI' ? "Contoh: Tim Agrososial" : "Nama Peserta"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Ketua / Lengkap</label>
                  <input
                    required
                    type="text"
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                    placeholder="Nama Lengkap"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instansi / Sekolah</label>
                  <input
                    required
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                    placeholder="Universitas / SMA..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Aktif</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                  placeholder="email@example.com"
                />
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                     <ExternalLink className="w-5 h-5" />
                   </div>
                </div>
                <div className="flex-grow">
                  <label className="block text-base font-bold text-blue-900 mb-1">
                    Link Google Drive
                  </label>
                  <p className="text-sm text-blue-700 mb-3">
                    Harap upload berkas (Karya, Scan Identitas, Bukti Bayar) ke folder Google Drive Anda, 
                    ubah akses menjadi <strong>"Anyone with link"</strong>, lalu tempel linknya di sini.
                  </p>
                  <input
                    required
                    type="url"
                    name="driveLink"
                    value={formData.driveLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="https://drive.google.com/drive/folders/..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Sedang Mengirim...' : 'Kirim Pendaftaran Saya'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ user }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'himasita2026') {
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
        console.error("Error fetching subs:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-emerald-900 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 text-sm">Area khusus panitia CPF 2026</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Masukkan Password Admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMsg && <p className="text-red-500 text-xs mt-2 text-center">{errorMsg}</p>}
            </div>
            <button type="submit" className="w-full bg-emerald-700 text-white py-3 rounded-lg font-bold hover:bg-emerald-800 transition-colors">
              Masuk Dashboard
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Rekapitulasi data pendaftar masuk</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">
            Keluar
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div></div>
        ) : submissions.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow text-center border-2 border-dashed border-gray-300">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Belum ada data pendaftaran masuk.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl overflow-hidden rounded-2xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Waktu', 'Kategori', 'Tim / Peserta', 'Instansi', 'Kontak', 'Berkas'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((sub, idx) => (
                    <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sub.createdAt ? new Date(sub.createdAt.seconds * 1000).toLocaleDateString('id-ID', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                          ${sub.category === 'LKTI' ? 'bg-blue-100 text-blue-800' : 
                            sub.category === 'Essay' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-purple-100 text-purple-800'}`}>
                          {sub.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{sub.teamName}</div>
                        <div className="text-xs text-gray-500 mt-1">{sub.leaderName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.institution}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center"><Phone className="w-3 h-3 mr-1"/> {sub.phone}</div>
                        <div className="text-xs mt-1 text-gray-400">{sub.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a href={sub.driveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md hover:bg-emerald-100 transition-colors">
                          <ExternalLink className="w-3 h-3 mr-1" /> Link Drive
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
    </div>
  );
};

const Footer = () => (
  <footer className="bg-emerald-950 text-emerald-200 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center text-white text-2xl font-bold mb-6 tracking-wide">
          <Leaf className="mr-2 text-yellow-400" /> HIMASITA UNSOED
        </div>
        <p className="text-sm text-emerald-400 max-w-sm leading-relaxed mb-6">
          Himpunan Mahasiswa Ilmu Hama dan Penyakit Tumbuhan Universitas Jenderal Soedirman. 
          Bergerak bersama mewujudkan pertanian tangguh melalui perlindungan tanaman yang presisi dan berkelanjutan.
        </p>
        <div className="flex space-x-4">
           <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-emerald-900 transition-colors cursor-pointer"><Mail className="w-4 h-4"/></div>
           <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-emerald-900 transition-colors cursor-pointer"><ExternalLink className="w-4 h-4"/></div>
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-6 border-b border-emerald-800 pb-2 inline-block">Navigasi Cepat</h4>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-1"/> Tentang CPF 2026</a></li>
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-1"/> Panduan Lomba</a></li>
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-1"/> Timeline Kegiatan</a></li>
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center"><ChevronRight className="w-3 h-3 mr-1"/> FAQ</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-6 border-b border-emerald-800 pb-2 inline-block">Hubungi Kami</h4>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start">
            <MapPin className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" /> 
            <span>Sekretariat HIMASITA, Fak. Pertanian UNSOED, Purwokerto, Jawa Tengah</span>
          </li>
          <li className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" /> 
            <span>himasita.site1@gmail.com</span>
          </li>
          <li className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" /> 
            <span>+62 812-3456-7890 (Narahubung)</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-emerald-900 text-center text-xs text-emerald-500">
      &copy; 2026 Crop Protection Fest - HIMASITA UNSOED. Developed for Simulation.
    </div>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Autentikasi Anonim agar user bisa submit form tanpa login
    const initAuth = async () => {
      if (auth) {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Gagal login anonim:", error);
        }
      }
    };
    
    initAuth();
    
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <Timeline />
            <Competitions setActiveTab={setActiveTab} />
          </>
        )}
        {activeTab === 'lomba' && <Competitions setActiveTab={setActiveTab} />}
        {activeTab === 'daftar' && <SubmissionForm user={user} />}
        {activeTab === 'admin' && <AdminPanel user={user} />}
      </main>

      <Footer />
    </div>
  );
}
