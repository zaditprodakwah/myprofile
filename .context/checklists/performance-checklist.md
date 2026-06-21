# Performance Optimization Checklist

- [ ] Web Vitals: LCP is under 1.5 seconds, CLS is 0, and INP is under 200 milliseconds.
- [ ] Next.js PPR: static parts of pages load instantly, dynamic elements stream via React Suspense.
- [ ] Bundle splits: lazily load heavy modules (like React Flow canvas editors) with Next.js dynamic imports.
- [ ] Table virtualization: TanStack Virtual manages tables containing more than 50 database rows.
- [ ] Edge Caching: static pages are cached at CDN Edge with on-demand tag revalidation.
