function getHttpOrigin(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export function getTrustedSiteOrigin(requestOrigin?: string | null) {
  return (
    getHttpOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    getHttpOrigin(requestOrigin)
  );
}
