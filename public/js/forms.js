// Service form definitions. Option arrays are [value, labelId, labelEn] or
// [labelId, labelEn], where the Indonesian label doubles as the value.
export const formSchemas = {
  guide: {
    title: { id: 'Booking Guide Lokal Jawa-Bali', en: 'Book a Local Guide in Java & Bali' },
    intro: {
      id: 'Ceritakan rencana Anda, saya akan mengecek ketersediaan dan membalas dalam 24 jam lewat WhatsApp atau email.',
      en: 'Tell me about your plans. I’ll check my availability and reply within 24 hours via WhatsApp or email.',
    },
    confirmation: {
      id: 'Terima kasih! Permintaan Anda sudah saya terima. Saya akan mengecek ketersediaan dan membalas dalam 24 jam lewat WhatsApp atau email.',
      en: 'Thank you! I’ve received your request. I’ll check availability and reply within 24 hours via WhatsApp or email.',
    },
    fields: [
      { section: { id: 'A. Tentang Anda', en: 'A. About You' } },
      { name: 'fullName', label: { id: 'Nama lengkap', en: 'Full name' }, type: 'text', required: true },
      { name: 'email', label: { id: 'Email', en: 'Email' }, type: 'email', required: true },
      {
        name: 'whatsapp',
        label: { id: 'Nomor WhatsApp (dengan kode negara)', en: 'WhatsApp number (with country code)' },
        type: 'tel',
        required: true,
      },
      {
        name: 'country',
        label: { id: 'Anda berasal dari negara mana?', en: 'Which country are you from?' },
        type: 'text',
      },
      { section: { id: 'B. Detail Tur', en: 'B. Tour Details' } },
      {
        name: 'package',
        label: { id: 'Paket mana yang Anda minati?', en: 'Which package are you interested in?' },
        type: 'select',
        required: true,
        options: [
          ['half', 'Half-day (sekitar 4 jam)', 'Half-day (around 4 hours)'],
          ['full', 'Full-day (8–10 jam)', 'Full-day (8–10 hours)'],
          ['multi', 'Multi-day (2 hari atau lebih)', 'Multi-day (2 days or more)'],
          ['unsure', 'Belum yakin, mohon saran', 'Not sure, please advise'],
        ],
      },
      { name: 'startDate', label: { id: 'Tanggal mulai', en: 'Start date' }, type: 'date', required: true },
      {
        name: 'endDate',
        label: { id: 'Tanggal selesai (untuk tur multi-day)', en: 'End date (for multi-day tours)' },
        type: 'date',
        conditional: 'multi',
      },
      {
        name: 'destinations',
        label: { id: 'Destinasi yang Anda minati', en: 'Which destinations interest you?' },
        type: 'checkboxes',
        options: [
          ['Semarang dan Jawa Tengah', 'Semarang and Central Java'],
          ['Yogyakarta', 'Yogyakarta'],
          ['Borobudur dan Prambanan', 'Borobudur and Prambanan'],
          ['Bromo dan Ijen', 'Bromo and Ijen'],
          ['Bali', 'Bali'],
          ['Lainnya', 'Other'],
        ],
      },
      {
        name: 'adults',
        label: { id: 'Jumlah orang dewasa', en: 'Number of adults' },
        type: 'number',
        required: true,
      },
      {
        name: 'children',
        label: {
          id: 'Jumlah anak-anak (sebutkan usianya)',
          en: 'Number of children (please list their ages)',
        },
        type: 'text',
      },
      {
        name: 'guideLanguage',
        label: { id: 'Bahasa pemandu yang Anda inginkan', en: 'Preferred guiding language' },
        type: 'select',
        required: true,
        options: [
          ['Inggris', 'English'],
          ['Indonesia', 'Indonesian'],
          ['Jawa', 'Javanese'],
        ],
      },
      {
        name: 'pickup',
        label: {
          id: 'Di mana Anda ingin dijemput? (nama hotel atau alamat)',
          en: 'Where should I pick you up? (hotel name or address)',
        },
        type: 'text',
      },
      { section: { id: 'C. Kebutuhan Khusus', en: 'C. Special Requests' } },
      {
        name: 'transport',
        label: {
          id: 'Apakah Anda membutuhkan transportasi dari saya?',
          en: 'Do you need transportation from me?',
        },
        type: 'select',
        required: true,
        options: [
          ['Ya, mohon sertakan', 'Yes, please include it'],
          ['Tidak, saya punya sendiri', 'No, I have my own'],
          ['Belum tahu', 'Not sure yet'],
        ],
      },
      {
        name: 'dietary',
        label: { id: 'Adakah pantangan makanan atau alergi?', en: 'Any dietary restrictions or allergies?' },
        type: 'textarea',
        sensitive: true,
      },
      {
        name: 'accessibility',
        label: {
          id: 'Adakah kondisi fisik atau kebutuhan aksesibilitas yang perlu saya ketahui?',
          en: 'Any physical conditions or accessibility needs I should know about?',
        },
        type: 'textarea',
        sensitive: true,
      },
      {
        name: 'expectations',
        label: {
          id: 'Apa yang paling Anda harapkan dari perjalanan ini?',
          en: 'What are you most looking forward to on this trip?',
        },
        type: 'textarea',
      },
      { name: 'notes', label: { id: 'Catatan tambahan', en: 'Additional notes' }, type: 'textarea' },
      { section: { id: 'D. Penutup', en: 'D. Final' } },
      {
        name: 'heardFrom',
        label: { id: 'Dari mana Anda mengenal saya?', en: 'How did you hear about me?' },
        type: 'select',
        options: [
          ['Instagram', 'Instagram'],
          ['Google', 'Google'],
          ['TripAdvisor', 'TripAdvisor'],
          ['Teman atau keluarga', 'Friends or family'],
          ['Lainnya', 'Other'],
        ],
      },
      {
        name: 'policy',
        label: {
          id: 'Saya sudah membaca dan menyetujui kebijakan DP dan pembatalan.',
          en: 'I have read and agree to the deposit and cancellation policy.',
        },
        type: 'checkbox',
        required: true,
      },
    ],
  },
  plan: {
    title: { id: 'Rancang Perjalanan Anda di Indonesia', en: 'Plan Your Trip to Indonesia' },
    intro: {
      id: 'Semakin lengkap jawaban Anda, semakin pas itinerary yang saya susun. Isi sekitar 5–7 menit.',
      en: 'The more you tell me, the better your itinerary will fit you. This takes about 5–7 minutes.',
    },
    confirmation: {
      id: 'Terima kasih! Saya akan mempelajari jawaban Anda dan mengirim penawaran serta langkah pembayaran dalam 24 jam.',
      en: 'Thank you! I’ll review your answers and send you a quote and payment steps within 24 hours.',
    },
    fields: [
      { section: { id: 'A. Kontak dan Layanan', en: 'A. Contact and Service' } },
      { name: 'fullName', label: { id: 'Nama lengkap', en: 'Full name' }, type: 'text', required: true },
      { name: 'email', label: { id: 'Email', en: 'Email' }, type: 'email', required: true },
      {
        name: 'whatsapp',
        label: { id: 'Nomor WhatsApp (dengan kode negara)', en: 'WhatsApp number (with country code)' },
        type: 'tel',
      },
      { name: 'timezone', label: { id: 'Zona waktu Anda', en: 'Your time zone' }, type: 'text' },
      {
        name: 'service',
        label: { id: 'Layanan apa yang Anda butuhkan?', en: 'Which service do you need?' },
        type: 'select',
        required: true,
        options: [
          ['custom', 'Itinerary Custom', 'Custom Itinerary'],
          ['recommend', 'Itinerary + Rekomendasi Booking', 'Itinerary + Booking Recommendations'],
          ['consultation', 'Konsultasi 1-on-1 via Google Meet', '1-on-1 Consultation via Google Meet'],
          ['management', 'Full Trip Management', 'Full Trip Management'],
        ],
      },
      { section: { id: 'B. Gambaran Perjalanan', en: 'B. Trip Overview' } },
      {
        name: 'travelWhen',
        label: {
          id: 'Kapan rencana perjalanan Anda? (tanggal atau bulan perkiraan)',
          en: 'When are you planning to travel? (exact dates or approximate month)',
        },
        type: 'text',
        required: true,
      },
      {
        name: 'days',
        label: {
          id: 'Berapa lama perjalanan Anda (jumlah hari)?',
          en: 'How long will your trip be (number of days)?',
        },
        type: 'number',
        required: true,
      },
      {
        name: 'cities',
        label: {
          id: 'Dari kota mana Anda akan berangkat, dan di mana Anda tiba di Indonesia?',
          en: 'Which city are you departing from, and where will you arrive in Indonesia?',
        },
        type: 'text',
      },
      {
        name: 'travelers',
        label: { id: 'Siapa saja yang bepergian?', en: 'Who is traveling?' },
        type: 'select',
        required: true,
        options: [
          ['Sendiri', 'Solo'],
          ['Pasangan', 'Couple'],
          ['Keluarga dengan anak', 'Family with children'],
          ['Keluarga tanpa anak', 'Family without children'],
          ['Teman-teman', 'Friends'],
          ['Lainnya', 'Other'],
        ],
      },
      {
        name: 'travelerCount',
        label: {
          id: 'Jumlah orang (dan usia anak, jika ada)',
          en: 'Number of travelers (and ages of children, if any)',
        },
        type: 'text',
        required: true,
      },
      {
        name: 'budget',
        label: {
          id: 'Perkiraan budget per orang atau total, beserta mata uangnya',
          en: 'Estimated budget per person or total, with currency',
        },
        type: 'text',
        required: true,
      },
      { section: { id: 'C. Gaya dan Minat', en: 'C. Style and Interests' } },
      {
        name: 'style',
        label: { id: 'Seperti apa gaya perjalanan yang Anda suka?', en: 'What is your travel style?' },
        type: 'checkboxes',
        required: true,
        options: [
          ['Santai', 'Relaxed'],
          ['Petualang', 'Adventure'],
          ['Budaya dan sejarah', 'Culture and history'],
          ['Kuliner', 'Food'],
          ['Alam dan pantai', 'Nature and beaches'],
          ['Belanja dan seni', 'Shopping and art'],
        ],
      },
      {
        name: 'accommodation',
        label: { id: 'Tingkat kenyamanan akomodasi', en: 'Preferred accommodation level' },
        type: 'select',
        options: [
          ['Hostel atau homestay', 'Hostel or homestay'],
          ['Hotel menengah', 'Mid-range hotel'],
          ['Hotel butik atau resor', 'Boutique hotel or resort'],
          ['Campuran', 'Mixed'],
        ],
      },
      {
        name: 'transport',
        label: { id: 'Bagaimana Anda ingin berpindah antar kota?', en: 'How would you like to get around?' },
        type: 'checkboxes',
        options: [
          ['Mobil dengan sopir', 'Car with driver'],
          ['Sewa motor', 'Motorbike rental'],
          ['Kereta api', 'Train'],
          ['Transportasi umum', 'Public transport'],
          ['Belum tahu', 'Not sure yet'],
        ],
      },
      {
        name: 'mustHave',
        label: {
          id: 'Tempat atau pengalaman yang wajib ada di rencana',
          en: 'Places or experiences that must be included',
        },
        type: 'textarea',
      },
      {
        name: 'avoid',
        label: {
          id: 'Hal yang ingin Anda hindari (misalnya tempat terlalu ramai)',
          en: 'Things you want to avoid (e.g. very crowded places)',
        },
        type: 'textarea',
      },
      {
        name: 'firstVisit',
        label: {
          id: 'Apakah ini kunjungan pertama Anda ke Indonesia?',
          en: 'Is this your first visit to Indonesia?',
        },
        type: 'select',
        options: [
          ['Ya', 'Yes'],
          ['Tidak, saya pernah ke Indonesia', 'No, I have been to Indonesia before'],
        ],
      },
      { section: { id: 'D. Kebutuhan Khusus dan Hasil', en: 'D. Special Needs and Deliverable' } },
      {
        name: 'specialNeeds',
        label: {
          id: 'Pantangan makanan, kondisi kesehatan, atau kebutuhan mobilitas',
          en: 'Dietary restrictions, health conditions, or mobility needs',
        },
        type: 'textarea',
        sensitive: true,
      },
      {
        name: 'occasion',
        label: {
          id: 'Adakah acara istimewa? (bulan madu, ulang tahun, dan sebagainya)',
          en: 'Any special occasion? (honeymoon, birthday, etc.)',
        },
        type: 'text',
      },
      {
        name: 'format',
        label: { id: 'Format itinerary yang Anda inginkan', en: 'Preferred itinerary format' },
        type: 'select',
        options: [
          ['PDF', 'PDF'],
          ['Google Docs', 'Google Docs'],
        ],
      },
      {
        name: 'itineraryLanguage',
        label: { id: 'Bahasa itinerary', en: 'Itinerary language' },
        type: 'select',
        options: [
          ['Inggris', 'English'],
          ['Indonesia', 'Indonesian'],
        ],
      },
      { name: 'notes', label: { id: 'Catatan tambahan', en: 'Additional notes' }, type: 'textarea' },
      {
        name: 'policy',
        label: {
          id: 'Saya memahami bahwa pembayaran dilakukan sebelum itinerary disusun dan revisi dibatasi sesuai paket.',
          en: 'I understand that payment is made before the itinerary is prepared and revisions are limited according to the package.',
        },
        type: 'checkbox',
        required: true,
      },
    ],
  },
  learn: {
    title: { id: 'Booking Kelas Online (Google Meet)', en: 'Book an Online Class (Google Meet)' },
    intro: {
      id: 'Kelas berlangsung online lewat Google Meet. Setelah jadwal disepakati, link kelas saya kirim ke email Anda.',
      en: 'Classes are held online via Google Meet. Once we agree on a time, I’ll email you the class link.',
    },
    confirmation: {
      id: 'Terima kasih sudah memesan kelas! Saya akan membalas dalam 24 jam untuk menyepakati jadwal, lalu mengirim link Google Meet ke email Anda.',
      en: 'Thanks for booking a class! I’ll reply within 24 hours to agree on a time, then email you the Google Meet link.',
    },
    fields: [
      { section: { id: 'A. Tentang Anda', en: 'A. About You' } },
      { name: 'fullName', label: { id: 'Nama lengkap', en: 'Full name' }, type: 'text', required: true },
      { name: 'email', label: { id: 'Email', en: 'Email' }, type: 'email', required: true },
      {
        name: 'whatsapp',
        label: { id: 'Nomor WhatsApp', en: 'WhatsApp number' },
        type: 'tel',
        required: true,
      },
      { section: { id: 'B. Detail Kelas', en: 'B. Class Details' } },
      {
        name: 'class',
        label: { id: 'Kelas yang Anda pilih', en: 'Which class do you want?' },
        type: 'select',
        required: true,
        options: [
          ['Bahasa Inggris', 'English'],
          ['Bahasa Indonesia', 'Indonesian'],
        ],
      },
      {
        name: 'format',
        label: { id: 'Format kelas', en: 'Class format' },
        type: 'select',
        required: true,
        options: [
          ['Privat (1 murid)', 'Private (1 student)'],
          ['Grup kecil', 'Small group'],
        ],
      },
      {
        name: 'level',
        label: { id: 'Level Anda saat ini', en: 'Your current level' },
        type: 'select',
        required: true,
        options: [
          ['Pemula', 'Beginner'],
          ['Menengah', 'Intermediate'],
          ['Lanjut', 'Advanced'],
          ['Belum tahu, mohon dites dulu', 'Not sure, please assess me'],
        ],
      },
      {
        name: 'goals',
        label: { id: 'Apa tujuan belajar Anda?', en: 'What is your learning goal?' },
        type: 'checkboxes',
        required: true,
        options: [
          ['Percakapan sehari-hari', 'Everyday conversation'],
          ['Pekerjaan', 'Work'],
          ['Ujian (IELTS, TOEFL, UKBI)', 'Exam (IELTS, TOEFL, UKBI)'],
          ['Traveling', 'Traveling'],
          ['Pindah atau tinggal di Indonesia', 'Moving to or living in Indonesia'],
          ['Lainnya', 'Other'],
        ],
      },
      {
        name: 'experience',
        label: {
          id: 'Ceritakan singkat pengalaman belajar Anda sebelumnya',
          en: 'Briefly describe your previous learning experience',
        },
        type: 'textarea',
      },
      {
        name: 'timezone',
        label: { id: 'Zona waktu Anda', en: 'Your time zone' },
        type: 'text',
        required: true,
      },
      {
        name: 'preferredTime',
        label: {
          id: 'Hari dan jam belajar yang paling cocok untuk Anda',
          en: 'Which days and times suit you best?',
        },
        type: 'text',
        required: true,
      },
      {
        name: 'policy',
        label: {
          id: 'Saya memahami kebijakan reschedule (perubahan jadwal minimal 24 jam sebelum kelas).',
          en: 'I understand the rescheduling policy (changes must be made at least 24 hours before class).',
        },
        type: 'checkbox',
        required: true,
      },
    ],
  },
  contact: {
    title: { id: 'Kontak Umum', en: 'General Contact' },
    intro: {
      id: 'Kirim pesan singkat dan saya akan membalas secepatnya.',
      en: 'Send a short message and I’ll get back to you soon.',
    },
    confirmation: {
      id: 'Terima kasih! Pesan Anda sudah masuk, saya akan membalas secepatnya.',
      en: 'Thank you! Your message has been received and I’ll get back to you soon.',
    },
    fields: [
      { name: 'name', label: { id: 'Nama', en: 'Name' }, type: 'text', required: true },
      { name: 'email', label: { id: 'Email', en: 'Email' }, type: 'email', required: true },
      {
        name: 'topic',
        label: { id: 'Topik', en: 'Topic' },
        type: 'select',
        required: true,
        options: [
          ['Booking Guide', 'Booking Guide'],
          ['Travel Plan', 'Travel Plan'],
          ['Kelas', 'Classes'],
          ['Kerja sama', 'Collaboration'],
          ['Lainnya', 'Other'],
        ],
      },
      { name: 'message', label: { id: 'Pesan Anda', en: 'Your message' }, type: 'textarea', required: true },
    ],
  },
};
