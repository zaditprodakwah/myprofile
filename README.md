# Zadit Intelligence Hub (v3.0)

A high-performance, database-driven intelligence platform designed for executive-level solutions, programmatic SEO (pSEO), and AI-driven growth.

## 🚀 Key Features (Upgrade 3.0)

- **Database-Driven Architecture**: Fully migrated to Supabase (PostgreSQL) for persistent entity management.
- **Intelligence Radar**: Automated ingestion and synthesis of global industry signals via RSS/API.
- **Authority pSEO Stack**: Dynamic tools directory and solution pages optimized for AEO/GEO/SERP authority.
- **AI Synthesis Engine**: Integrated Groq (Llama-3-70b) and Google Gemini (1.5-flash) for autonomous content generation and summaries.
- **Smart Search Engine**: Global search interface (Cmd+K) with AI-powered suggestions.
- **Inquiry Wizard**: Multi-step conversion engine with real-time lead capture.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL), Vercel Cron
- **AI**: Groq API, Gemini API
- **Design**: Premium Glassmorphism, Cinematic Animations, Dark Mode Optimized

## 📂 Project Structure

- `src/`: Core application logic and UI components.
- `supabase/`: SQL schema and migration scripts.
- `public/`: Static assets and icons.
- `temp_docs/`: Design documents and technical specifications.
- `data/`: Seed Data (JSON) for pSEO expansion.

## 🚦 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` in the root directory with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
4. **Seed the Database**:
   ```bash
   npx tsx src/scripts/seed-data.ts
   ```
5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---
*Built with precision by Zadit Intelligence.*
