// apps/web/config.js

const DEFAULT_PORT = process.env.API_PORT ?? '3001';

const fromEnv = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
    return `https://${process.env.CODESPACE_NAME}-${DEFAULT_PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return null;
};

const fromWindowLocation = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const { protocol, hostname } = window.location;

  if (!hostname) {
    return null;
  }

  if (hostname.endsWith('.app.github.dev')) {
    return `https://${hostname.replace(/-\d+(?=\.app\.github\.dev$)/, `-${DEFAULT_PORT}`)}`;
  }

  return `${protocol}//${hostname}:${DEFAULT_PORT}`;
};

const pickHeader = (value) => (Array.isArray(value) ? value[0] : value);

const fromRequest = (req) => {
  if (!req || !req.headers) {
    return null;
  }

  const forwardedProto = pickHeader(req.headers["x-forwarded-proto"]);
  const forwardedHost = pickHeader(req.headers["x-forwarded-host"]);
  const hostHeader = pickHeader(req.headers.host);

  const host = forwardedHost ?? hostHeader;
  if (!host) {
    return null;
  }

  const sanitized = host.split(",")[0]?.trim();
  if (!sanitized) {
    return null;
  }

  if (sanitized.endsWith(".app.github.dev")) {
    return `https://${sanitized.replace(/-\d+(?=\.app\.github\.dev$)/, `-${DEFAULT_PORT}`)}`;
  }

  const hostname = sanitized.includes(":") ? sanitized.split(":")[0] : sanitized;
  const protocol = forwardedProto ?? "http";

  return `${protocol}://${hostname}:${DEFAULT_PORT}`;
};

const getApiBaseUrl = (req) =>
  fromEnv() ?? fromRequest(req) ?? fromWindowLocation() ?? `http://localhost:${DEFAULT_PORT}`;

export default getApiBaseUrl;
