// Base URL igual ao auth config
const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim().replace(/\/$/, '')

const apiRoot = base ? `${base}/api/v1` : '/api/v1'

export default {
  listEndpoint: `${apiRoot}/rarities`, // GET
  createEndpoint: `${apiRoot}/rarities`, // POST
  updateEndpoint: (id: string) => `${apiRoot}/rarities/${id}`, // PUT/PATCH
  deleteEndpoint: (id: string) => `${apiRoot}/rarities/${id}` // DELETE
}
