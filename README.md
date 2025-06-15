# 🛍️ Seller Pintar CMS Blog

Seller Pintar adalah sistem manajemen konten (CMS) yang dibuat dengan **Next.js App Router**, **Supabase**, dan **Tailwind CSS**. Aplikasi ini memungkinkan pengguna untuk membuat, mengedit, menghapus, dan melihat artikel blog yang dikategorikan, lengkap dengan fitur preview, markdown editor, dan sistem autentikasi.

## ✨ Fitur Utama

- 🔐 Autentikasi login & register menggunakan Supabase
- 🧠 CRUD Kategori & Artikel
- 🖋️ Editor artikel
- 🧾 Validasi form menggunakan Zod
- 🔍 Search, pagination, dan debounce di daftar artikel
- 🖼️ Upload gambar (URL-based)
- 🧭 Routing dinamis dengan proteksi akses halaman
- 📱 Desain responsif dengan Tailwind CSS

## 🚀 Teknologi yang Digunakan

- [Next.js 14 (App Router)](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [Shadcn/UI](https://ui.shadcn.dev/)
- [Lucide React Icons](https://lucide.dev/icons)

## 🧱 Struktur Folder

\`\`\`bash
├── app/
│   ├── login/              # Halaman login
│   ├── register/           # Halaman register
│   ├── dashboard/          # Dashboard kategori & artikel
│   └── article/[slug]/     # Halaman detail artikel (dynamic route)
│
├── components/             # UI dan form component
│   └── dashboard-components/
│
├── lib/                    # Supabase client & validasi Zod
│
├── public/                 # Gambar statis & asset
├── styles/                 # Global styles
\`\`\`

## 📦 Instalasi

1. **Clone repo ini**

\`\`\`bash
git clone https://github.com/Raffyshira/seller-pintar-test.git
cd seller-pintar-test
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Setup Supabase**

- Buat project baru di [Supabase](https://app.supabase.io/)
- Salin \`anon key\` dan \`project URL\`, lalu buat file \`.env.local\`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

4. **Setup Tabel Supabase**

Kamu membutuhkan tabel berikut:

- \`categories\`:
  - \`id\` (UUID, Primary Key)
  - \`name\` (Text)

- \`articles\`:
  - \`id\` (UUID, Primary Key)
  - \`title\` (Text)
  - \`slug\` (Text)
  - \`content\` (Text)
  - \`thumbnail\` (Text)
  - \`category_id\` (UUID, Foreign Key)
  - \`created_at\` (Timestamp)

**Relasi:** \`articles.category_id → categories.id\`

5. **Jalankan proyek**

\`\`\`bash
npm run dev
\`\`\`

## 🧪 Fitur CMS

### 🔖 Kategori

- Buat, edit, dan hapus kategori
- Filter artikel berdasarkan kategori

### 📝 Artikel

- Buat & edit artikel dengan editor markdown (Tiptap)
- Fitur preview sebelum publish
- Slug URL otomatis dari judul
- Menampilkan artikel terkait di halaman detail

## 🛠️ Pengembangan

### Build untuk production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Testing
Username: Admin
Password: Admin12345

### Deployment

- Dapat langsung dideploy ke [Vercel](https://vercel.com/) atau [Netlify](https://netlify.com/)
- Pastikan environment variable diatur dengan benar di dashboard deploy

## 🙋‍♂️ Kontribusi

Pull Request terbuka untuk perbaikan, refactor, atau penambahan fitur baru.

## 📄 Lisensi

MIT License © 2025 Rafi Ahsira Prayoga