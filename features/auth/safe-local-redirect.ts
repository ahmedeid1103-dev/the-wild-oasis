const LOCAL_ORIGIN = "https://wild-oasis.local";

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
