// Trim whitespace/newlines and remove a trailing slash so the base URL is clean
const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim().replace(/\/$/, '')

export default {
  meEndpoint: base ? `${base}/api/v1/auth/me` : '/auth/me',
  loginEndpoint: base ? `${base}/api/v1/auth/login` : '/jwt/login',
  registerEndpoint: base ? `${base}/api/v1/auth/register` : '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
