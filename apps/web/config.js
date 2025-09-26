// apps/web/config.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `https://${process.env.CODESPACE_NAME}-3001.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : 'http://localhost:3001');

export default API_BASE_URL;
