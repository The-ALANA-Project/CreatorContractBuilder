import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: Record<string, unknown>;
}

export function useSEO({ title, description, canonical, jsonLd }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Canonical
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    // OG tags
    const og = (prop: string, val: string) => {
      const el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
      if (el) el.setAttribute("content", val);
    };
    og("og:title", title);
    og("og:description", description);
    og("og:url", canonical);

    // Twitter tags
    const tw = (name: string, val: string) => {
      const el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (el) el.setAttribute("content", val);
    };
    tw("twitter:title", title);
    tw("twitter:description", description);
    tw("twitter:url", canonical);

    // JSON-LD
    if (jsonLd) {
      const id = "route-jsonld";
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, canonical, jsonLd]);
}
