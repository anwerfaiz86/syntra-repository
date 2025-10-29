import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// NOTE: axios will set Content-Type for FormData automatically when using FormData

export async function createDefect(formData) {
  try {
    const res = await client.post('/defects', formData);
    return res.data;
  } catch (err) {
    // normalize error
    const message = err?.response?.data?.error || err.message || 'Create failed';
    throw new Error(message);
  }
}

export async function getDefects(query = '') {
  try {
    const res = await client.get(`/defects${query}`);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.error || err.message || 'Fetch failed';
    throw new Error(message);
  }
}

export async function patchDefect(id, body) {
  try {
    const res = await client.patch(`/defects/${id}`, body);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.error || err.message || 'Update failed';
    throw new Error(message);
  }
}

export async function getCounts() {
  try {
    const res = await client.get('/defects/counts/summary');
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.error || err.message || 'Counts failed';
    throw new Error(message);
  }
}
