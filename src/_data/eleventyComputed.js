// Builds the breadcrumb trail for every page so both the layout (visible nav)
// and <head> (BreadcrumbList schema) can use it.
// Front matter: `parent: { label: "About", url: "/about/" }` (optional)
export default {
  crumbs: (data) => {
    if (!data.title || data.page.url === "/" || data.noindex) return undefined;
    const trail = [{ label: "Home", url: "/" }];
    if (data.parent) trail.push(data.parent);
    trail.push({ label: data.title, url: data.page.url });
    return trail;
  },
};
