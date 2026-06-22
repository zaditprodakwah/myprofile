#!/bin/bash
# ==============================================================================
# Script: seed-directory-gosom.sh
# Deskripsi: Wrapper untuk menjalankan gosom/google-maps-scraper via Docker
# Kegunaan: Mode 1 (Seed Awal) direktori bisnis PresenceOS
# ==============================================================================

# Pastikan Docker berjalan
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker tidak berjalan. Harap buka Docker Desktop terlebih dahulu."
  exit 1
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$DIR")"

QUERIES_FILE="$DIR/queries.txt"
OUTPUT_DIR="$DIR/output"

# Pastikan queries.txt ada
if [ ! -f "$QUERIES_FILE" ]; then
  echo "⚠️ queries.txt tidak ditemukan, membuat template..."
  echo "Jasa pembuatan website di Jakarta Selatan" > "$QUERIES_FILE"
  echo "Konsultan pajak di Surabaya" >> "$QUERIES_FILE"
  echo "Agensi digital marketing di Bandung" >> "$QUERIES_FILE"
fi

mkdir -p "$OUTPUT_DIR"

echo "🚀 Menjalankan Google Maps Scraper (Mode 1: Seed Data)..."
echo "📂 Membaca query dari: $QUERIES_FILE"
echo "📂 Menyimpan hasil ke: $OUTPUT_DIR/results.csv"

# Perintah utama Docker sesuai research.md
docker run --rm \
  -v gmaps-playwright-cache:/opt \
  -v "$QUERIES_FILE:/queries.txt:ro" \
  -v "$OUTPUT_DIR:/out" \
  gosom/google-maps-scraper \
  -input /queries.txt -results /out/results.csv \
  -depth 1 -email -c 4 -exit-on-inactivity 3m

echo "✅ Proses scraping lokal selesai. Hasil tersedia di $OUTPUT_DIR/results.csv"
echo "Silakan import file CSV tersebut ke tabel 'organizations' di Supabase."
