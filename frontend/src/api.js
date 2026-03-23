const API_URL = '/api';

function toNetworkErrorMessage(message) {
  if (typeof message !== 'string') return '';
  const normalized = message.toLowerCase();
  if (normalized.includes('failed to fetch') || normalized.includes('networkerror')) {
    return 'Không kết nối được backend. Hãy chạy backend tại http://localhost:5000 rồi thử lại.';
  }
  return '';
}

async function parseJsonSafely(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function requestJson(path, options) {
  try {
    const response = await fetch(`${API_URL}${path}`, options);
    const data = await parseJsonSafely(response);
    if (!response.ok) {
      const message = data?.message || 'Có lỗi xảy ra.';
      throw new Error(message);
    }
    return data;
  } catch (err) {
    const nicer = toNetworkErrorMessage(err?.message);
    if (nicer) throw new Error(nicer);
    throw err;
  }
}

export function getProducts({ search, category } = {}) {
  const params = new URLSearchParams();
  if (search?.trim()) params.append('search', search.trim());
  if (category && category !== 'All') params.append('category', category);
  const query = params.toString();
  return requestJson(`/products${query ? `?${query}` : ''}`);
}

export function getProductById(id) {
  return requestJson(`/products/${id}`);
}

export function createProduct(payload) {
  return requestJson('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id, payload) {
  return requestJson(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id) {
  return requestJson(`/products/${id}`, { method: 'DELETE' });
}
