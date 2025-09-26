// apps/web/config.js

const DEFAULT_PORT = process.env.API_PORT ?? '3001';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `https://${process.env.CODESPACE_NAME}-3001.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : 'http://localhost:3001');


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

const getApiBaseUrl = () => fromEnv() ?? fromWindowLocation() ?? `http://localhost:${DEFAULT_PORT}`;

export default getApiBaseUrl;
