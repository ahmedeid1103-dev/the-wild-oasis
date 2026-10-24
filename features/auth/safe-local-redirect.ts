const LOCAL_ORIGIN = "https://wild-oasis.local";

// We never trust a raw `next` URL from a form submission.
// This helper only allows same-site, relative paths so we do not open redirect vulnerabilities.
export function safeLocalRedirect(value: unknown, fallback = "/account") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  const destination = new URL(value, LOCAL_ORIGIN);

  if (destination.origin !== LOCAL_ORIGIN) {
    return fallback;
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
