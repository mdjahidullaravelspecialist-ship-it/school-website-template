import fs from "node:fs";
import path from "node:path";

// Stylesheets are concatenated in this order into dist/assets/css/main.css
const CSS_FILES = ["tokens.css", "base.css", "components.css", "pages.css"];

export default function (eleventyConfig) {
  /* ---------- Static assets ---------- */
  eleventyConfig.addPassthroughCopy({
    "src/assets/js": "assets/js",
    "src/assets/images": "assets/images",
  });
  eleventyConfig.addWatchTarget("src/assets/css/");

  /* ---------- CSS bundle (no build tool needed) ---------- */
  eleventyConfig.on("eleventy.before", async () => {
    const out = path.join("dist", "assets", "css");
    fs.mkdirSync(out, { recursive: true });
    const css = CSS_FILES.map((f) => fs.readFileSync(path.join("src/assets/css", f), "utf8")).join("\n");
    const min = process.env.ELEVENTY_RUN_MODE === "serve" ? css : css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*\n\s*/g, "\n");
    fs.writeFileSync(path.join(out, "main.css"), min);
  });

  /* ---------- Filters & shortcodes ---------- */
  eleventyConfig.addFilter("dateFormat", (value, opts = { day: "numeric", month: "long", year: "numeric" }) =>
    new Intl.DateTimeFormat("en-GB", opts).format(new Date(value)));
  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString().slice(0, 10));
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("absoluteUrl", (url, base) => new URL(url, base).href);
  eleventyConfig.addFilter("startsWith", (str, prefix) => typeof str === "string" && str.startsWith(prefix));
  eleventyConfig.addFilter("hasUrl", (items, url) => (items || []).some((i) => i.url === url));
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // EducationalOrganization JSON-LD built from site.json
  eleventyConfig.addFilter("orgSchema", (site) => {
    const sameAs = Object.values(site.social || {}).filter(Boolean);
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: site.name,
      alternateName: site.shortName,
      url: site.url,
      logo: new URL(site.logo.src, site.url).href,
      description: site.description,
      email: site.contact.email,
      telephone: site.contact.phone,
      address: { "@type": "PostalAddress", streetAddress: site.contact.address.street, addressLocality: site.contact.address.city, addressCountry: site.contact.address.country },
      ...(sameAs.length ? { sameAs } : {}),
    });
  });

  eleventyConfig.addFilter("breadcrumbSchema", (crumbs, site) =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: new URL(c.url, site.url).href })),
    }));

  return {
    dir: { input: "src", output: "dist", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
