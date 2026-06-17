import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Zadit Growth Portfolio",
  description: "Kebijakan Privasi dan Perlindungan Data untuk pengunjung Zadit Growth Portfolio.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-32 pb-24 px-6 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 border-b border-brand-border pb-8">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Legal & Compliance</span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary">
              Privacy Policy
            </h1>
            <p className="text-sm font-mono text-text-muted">Terakhir Diperbarui: Juni 2026</p>
          </div>

          <div className="prose prose-sm md:prose-base prose-slate max-w-none space-y-8 text-text-muted leading-relaxed font-sans">
            <section className="space-y-4">
              <h2 className="text-xl font-heading-sans font-bold text-text-primary">1. Pendahuluan</h2>
              <p>
                Selamat datang di Zadit Growth Portfolio. Kami sangat menghargai privasi Anda dan berkomitmen
                untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, 
                menggunakan, dan melindungi informasi Anda saat Anda mengunjungi situs kami atau menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading-sans font-bold text-text-primary">2. Informasi yang Kami Kumpulkan</h2>
              <p>
                Kami dapat mengumpulkan informasi berikut saat Anda menggunakan situs web kami:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Informasi Kontak:</strong> Nama, alamat email, atau nomor WhatsApp saat Anda mengisi formulir (seperti formulir kemitraan atau permintaan audit).</li>
                <li><strong>Informasi Teknis:</strong> URL situs web Anda untuk keperluan audit kecepatan, serta data analitik dasar (seperti IP address yang dianonimkan, jenis browser) untuk optimasi UX.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading-sans font-bold text-text-primary">3. Penggunaan Informasi</h2>
              <p>
                Informasi yang kami kumpulkan digunakan untuk:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Menyediakan layanan yang Anda minta (contoh: Laporan Audit Kecepatan atau proposal kemitraan).</li>
                <li>Menghubungi Anda terkait layanan bisnis, konsultasi, dan dukungan teknis.</li>
                <li>Memahami dan menganalisis bagaimana pengunjung menggunakan situs web untuk meningkatkan UI/UX secara berkelanjutan.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading-sans font-bold text-text-primary">4. Perlindungan Data</h2>
              <p>
                Kami menerapkan langkah-langkah keamanan teknis untuk memastikan informasi Anda tidak disalahgunakan,
                diakses tanpa izin, atau dibagikan ke pihak ketiga yang tidak berkepentingan. Kami tidak pernah 
                menjual data pelanggan kepada pihak ketiga mana pun.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-heading-sans font-bold text-text-primary">5. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin meminta penghapusan 
                data Anda dari sistem kami, jangan ragu untuk menghubungi kami melalui{' '}
                <a href="https://kontak.link/muhzadit" className="text-teal-accent hover:underline font-medium">Kontak.Link</a> atau WhatsApp resmi.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
