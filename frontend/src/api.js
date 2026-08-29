const BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/'

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || JSON.stringify(body) || 'Permintaan gagal')
  }
  return response.status === 204 ? null : response.json()
}

const crud = (path) => ({
  list: (search = '') => request(`${BASE}${path}/${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  get: (id) => request(`${BASE}${path}/${id}/`),
  create: (payload) => request(`${BASE}${path}/`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`${BASE}${path}/${id}/`, { method: 'PUT', body: JSON.stringify(payload) }),
  patch: (id, payload) => request(`${BASE}${path}/${id}/`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id) => request(`${BASE}${path}/${id}/`, { method: 'DELETE' }),
})

export const courseApi = crud('courses')

export const participantApi = {
  ...crud('participants'),
  list: (search = '', page = 1) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    params.set('page', page)
    return request(`${BASE}participants/?${params.toString()}`)
  },
}

export const activityApi = {
  list: (search = '') => request(`${BASE}activities/${search ? `?search=${encodeURIComponent(search)}` : ''}`),
}

export const weatherApi = {
  get: (city) => request(`${BASE}weather/?q=${encodeURIComponent(city)}`),
}
