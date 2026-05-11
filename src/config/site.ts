export const siteConfig = {
  name: "Zadit Personal Hub",
  owner: "Muhammad Khoiruzzadittaqwa (Zadit)",
  description: "Senior Full-Stack Architect, Growth Hacker, and Academic Consultant.",
  url: "https://zadit.dev", // Update with actual URL
  ogImage: "/og.png",
  links: {
    whatsapp: "https://wa.me/6282316363177",
    email: "muhzadit@gmail.com",
    github: "https://github.com/muhzadit",
    linkedin: "https://linkedin.com/in/muhzadit",
  },
  contact: {
    phone: "+62 823-1636-3177",
    address: "Cirebon, Indonesia",
  },
  metadata: {
    title: {
      default: "Zadit | Architecting Systems & Engineering Growth",
      template: "%s | Zadit",
    },
    description: "Professional profile of Muhammad Khoiruzzadittaqwa. Expertise in Digital Marketing, Academic Research, and Business Intelligence.",
  }
};

export type SiteConfig = typeof siteConfig;
