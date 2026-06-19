import { Article, Entity, City } from './types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';

/**
 * Generates JSON-LD Article Schema for Blog Articles & Reference Items
 */
export function generateArticleSchema(article: Article | any) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.meta_description || article.summary || "",
    "inLanguage": "id",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`
    },
    "author": {
      "@type": "Person",
      "name": article.author_name || "Muhammad Khoiruzzadittaqwa",
      "jobTitle": "Full-Stack Growth Architect",
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zadit Growth Engine",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/icon.png`
      }
    },
    "datePublished": article.published_at || article.created_at || new Date().toISOString(),
    "dateModified": article.updated_at || new Date().toISOString()
  };
}

/**
 * Generates JSON-LD Directory Schema for Cities and local business listings
 */
export function generateDirectorySchema(city: City, entities: Entity[]) {
  const itemListElement = entities.map((ent, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/directory/${city.slug}/${ent.slug}`,
      "name": ent.name,
      "description": ent.tagline || ent.description || "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": ent.address || "",
        "addressLocality": city.name,
        "addressCountry": "ID"
      },
      "telephone": ent.contact_phone || "",
      "url": ent.website_url || `${SITE_URL}/directory/${city.slug}/${ent.slug}`
    }
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Direktori Bisnis Lokal & Layanan Terverifikasi di ${city.name}`,
    "description": `Daftar lengkap bisnis, agensi, dan institusi terverifikasi di wilayah ${city.name} dengan audit kecepatan & optimasi SEO.`,
    "url": `${SITE_URL}/directory/${city.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": entities.length,
      "itemListElement": itemListElement
    }
  };
}

/**
 * Generates JSON-LD Breadcrumb List Schema
 */
export function generateBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.path}`
    }))
  };
}
