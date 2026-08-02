# Supabase Auth URL Configuration — Setup Guide

## 🔑 MASALAH YANG SERING TERJADI

Setelah klik "Sign in dengan Google" di form pendaftaran, user di-redirect balik ke URL seperti:

```
http://localhost:3000/?code=1224167d-0e14-4820-9a07-087a9d8c28bf
```

Tapi modal tidak auto-open. Ini karena:

1. **Redirect URL belum di-whitelist** di Supabase Dashboard
2. **Port dev server tidak cocok** (code jalan di port 3001, tapi redirect ke 3000)

---

## ✅ SOLUSI: Setup Supabase Auth URLs

### Step 1: Buka Supabase Dashboard

**URL:** https://supabase.com/dashboard/project/utzwxupemjrwdsemuuib/auth/url-configuration

### Step 2: Set "Site URL"

Isi dengan URL production utama:

```
https://riana-dnkf.vercel.app
```

### Step 3: Tambah "Redirect URLs"

Klik "Add URL" untuk setiap URL ini:

| URL | Untuk apa |
|---|---|
| `https://riana-dnkf.vercel.app/**` | Production (Vercel) |
| `http://localhost:3000/**` | Dev lokal (port default Next.js) |
| `http://localhost:3001/**` | Dev lokal (port alternatif) |
| `https://riana-dnkf-git-main-alis-projects-2652cb6d.vercel.app/**` | Preview branch (kalau ada) |

**Penting:** Gunakan wildcard `/**` di akhir supaya semua path diterima (termasuk `/?code=...`).

### Step 4: Klik "Save"

Tunggu beberapa detik, perubahan langsung aktif.

---

## 🧪 CARA TEST

### Test di Dev Lokal (port 3000 atau 3001)

1. Jalankan dev server:
   ```bash
   bun dev  # atau: npx next dev -p 3000
   ```

2. Buka `http://localhost:3000` di browser

3. Klik "Daftar Sekarang" → pilih kota → "Sign in dengan Google"

4. Login Google → redirect balik ke:
   ```
   http://localhost:3000/?code=xxx
   ```

5. **Modal akan auto-open** dengan form yang sudah ter-fill name + email dari Google

### Test di Production (Vercel)

1. Buka `https://riana-dnkf.vercel.app/`
2. Klik "Daftar Sekarang" → pilih kota → "Sign in dengan Google"
3. Login Google → redirect balik ke:
   ```
   https://riana-dnkf.vercel.app/?code=xxx
   ```
4. Modal auto-open, form terisi otomatis

---

## 🔧 YANG SUDAH DIPERBAIKI DI CODE

Saya sudah update code supaya detect multiple OAuth callback URL formats:

### `src/app/page.tsx`
```js
// Detek 3 format OAuth callback:
// 1. ?code=xxx        (authorization code, paling umum)
// 2. ?register=1      (custom flag)
// 3. #access_token=xxx (implicit flow, jarang)
if (hasOAuthCode || hasRegister || hasHashToken) {
  setRegisterOpen(true);
}
```

### `src/components/RegisterModal.tsx`
```js
// Restore selectedCity dari sessionStorage
// Check session via supabase.auth.getSession()
// Listen to onAuthStateChange untuk handle code exchange
// Auto-cleanup URL params setelah session didapat
```

---

## 📋 CHECKLIST TROUBLESHOOTING

Kalau OAuth masih gagal, cek:

- [ ] **Supabase Dashboard → Authentication → URL Configuration**
  - Site URL: `https://riana-dnkf.vercel.app`
  - Redirect URLs: termasuk `http://localhost:3000/**` dan `https://riana-dnkf.vercel.app/**`

- [ ] **Supabase Dashboard → Authentication → Providers → Google**
  - Google provider: ENABLED
  - Client ID: dari Google Cloud Console
  - Client Secret: dari Google Cloud Console

- [ ] **Google Cloud Console → APIs & Services → Credentials**
  - OAuth 2.0 Client ID dengan Authorized redirect URIs:
    ```
    https://utzwxupemjrwdsemuuib.supabase.co/auth/v1/callback
    ```
  - Authorized JavaScript origins:
    ```
    https://riana-dnkf.vercel.app
    http://localhost:3000
    http://localhost:3001
    ```

- [ ] **Vercel Environment Variables**
  - `NEXT_PUBLIC_SUPABASE_URL` ✓
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
  - `SUPABASE_SERVICE_ROLE_KEY` ✓
  - `NEXT_PUBLIC_ADMIN_EMAIL` ✓

- [ ] **Browser Console**
  - Buka DevTools → Console
  - Lihat error saat klik "Sign in dengan Google"
  - Kalau ada error CORS / redirect_uri_mismatch → masalah di Google Console
