import { Article, Entity, City, Service } from './types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';

/**
 * Generates JSON-LD Article Schema for Blog Articles & Reference Items
 */
export function generateArticleSchema(article: Article | any) {
  const url = `${SITE_URL}/blog/${article.slug}`;
  const isReference = article.category !== undefined;
  const wordCount = article.content ? article.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
  
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.meta_description || article.summary || "",
    "inLanguage": "id",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "url": url,
    "image": `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=${isReference ? 'reference' : 'blog'}&subtitle=${encodeURIComponent((article.meta_description || article.summary || '').substring(0, 110))}`,
    "wordCount": wordCount,
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

/**
 * Generates JSON-LD LocalBusiness & GeoCoordinates Schema for a City Directory
 */
export function generateCitySchema(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Zadit Growth Engine - Partner Strategi Digital ${city.name}`,
    "description": `Layanan konsultasi SEO teknikal, copywriting konversi, dan optimasi web berbasis data di wilayah ${city.name} dan sekitarnya.`,
    "url": `${SITE_URL}/directory/${city.slug}`,
    "telephone": "+6282316363177",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": Number(city.latitude),
      "longitude": Number(city.longitude)
    },
    "sameAs": [
      SITE_URL,
      "https://github.com/muhzadit",
      "https://www.linkedin.com/in/muhzadit"
    ]
  };
}

/**
 * Generates WebSite Schema with SearchAction
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zadit Growth Portfolio",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/blog?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Generates ItemList schema of services
 */
export function generateServiceListSchema(services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Layanan Rekayasa Pertumbuhan Zadit Engine",
    "numberOfItems": services.length,
    "itemListElement": services.map((svc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": svc.title,
        "description": svc.description,
        "provider": {
          "@type": "Person",
          "name": "Muhammad Khoiruzzadittaqwa"
        }
      }
    }))
  };
}

/**
 * Generates Extended Person Schema
 */
export function generatePersonSchemaFull() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Muhammad Khoiruzzadittaqwa",
    "alternateName": ["Zadit", "Aditt", "Muhzadit"],
    "jobTitle": "Full-Stack Growth Architect",
    "description": "Spesialis SEO teknikal, copywriting konversi, dan strategi digital marketing dengan pengalaman 10+ tahun sejak 2015.",
    "url": SITE_URL,
    "image": `${SITE_URL}/api/og?type=home`,
    "knowsAbout": [
      "SEO Teknikal", "AEO", "GEO", "Copywriting",
      "Digital Marketing", "Brand Strategy", "Content Marketing",
      "Administrative Management", "Broadcasting"
    ],
    "sameAs": [
      "https://github.com/muhzadit",
      "https://www.linkedin.com/in/muhzadit",
      "https://www.instagram.com/muhzadit",
      "https://wa.me/6282316363177",
      "https://kontak.link/muhzadit",
      "https://id.wikipedia.org/wiki/Pemasaran_digital"
    ]
  };
}

