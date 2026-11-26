/** Root-relative same-origin path: "/foo", not "//evil.com" or a protocol URL. */
export function isSafeSitePath(value: string): boolean {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return false;
  }
  if (value.includes("://") || /[\s<>"'`]/.test(value)) {
    return false;
  }
  return true;
}

export function isSafeHref(value: string): boolean {
  if (!value) return false;

  if (value.startsWith("#")) {
    return !value.toLowerCase().includes("javascript:");
  }

  if (value.toLowerCase().startsWith("mailto:")) {
    const rest = value.slice("mailto:".length);
    return rest.length > 0 && !/[\s<>"'`]/.test(rest) && !rest.toLowerCase().includes("javascript:");
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    const path = value.split(/[?#]/, 1)[0] ?? value;
    return isSafeSitePath(path);
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  return false;
}
