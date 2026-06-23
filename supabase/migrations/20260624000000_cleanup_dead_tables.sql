-- Tahap 2: Stabilisasi Database - Clean Up Dead Tables
-- Menghapus tabel-tabel sisa migrasi/eksperimen yang tidak dipakai di aplikasi

DROP TABLE IF EXISTS intelligence_entities CASCADE;
DROP TABLE IF EXISTS paa_questions CASCADE;
DROP TABLE IF EXISTS saved_audits CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS scraping_queues CASCADE;
DROP TABLE IF EXISTS audit_engine_cache CASCADE;

-- Catatan:
-- * intelligence_entities: Sisa eksperimen Sovereign yang tidak pernah terhubung
-- * paa_questions: Bank FAQ tidak digunakan karena FAQ diinjeksi langsung ke JSON artikel
-- * saved_audits: Tidak digunakan, utility_leads menyimpan data lead hasil audit
-- * admin_logs: Belum diimplementasikan
-- * page_views: Privacy tracker yang belum selesai, UI frontend tidak mengirim view
-- * scraping_queues: Hanya mock setTimeout 5 detik
-- * audit_engine_cache: Data basi & membebani query
