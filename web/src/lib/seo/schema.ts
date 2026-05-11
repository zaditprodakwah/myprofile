export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zadit Intelligence Hub",
    "url": "https://zadit.pro",
    "logo": "https://zadit.pro/logo.png",
    "sameAs": [
      "https://twitter.com/zadit",
      "https://github.com/zaditprodakwah"
    ]
  };
}

export function generateSoftwareSchema(tool: { name: string; description: string; url: string; price: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": tool.price === "Free" ? "0" : "1",
      "priceCurrency": "USD"
    },
    "description": tool.description
  };
}
