// Shim supabase client to talk to local backend APIs.
// This keeps the frontend imports unchanged: import { supabase } from "@/integrations/supabase/client";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const auth = {
  async signInWithPassword({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      return { data: null, error: null };
    }
    return { data: null, error: data };
  },
  async signUp({ email, password }, options) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: options?.data?.full_name })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      return { data: null, error: null };
    }
    return { data: null, error: data };
  },
  async getSession() {
    const token = localStorage.getItem("token");
    if (!token) return { data: { session: null } };
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { data: { session: { user: { id: payload.id } } } };
    } catch (e) {
      return { data: { session: null } };
    }
  },
  onAuthStateChange(cb) {
    this.getSession().then(({ data }) => cb(data.session ? 'SIGNED_IN' : 'SIGNED_OUT', data.session));
    return { data: null };
  },
  async signOut() {
    localStorage.removeItem("token");
    return { error: null };
  }
};

function tableClient(table) {
  const filters = [];
  let selectCols = "*";
  let singleFlag = false;
  let orderBy = null;
  return {
    select(cols="*") { selectCols = cols; return this; },
    eq(k,v){ filters.push({ k, v }); return this; },
    order(k, opts){ orderBy = { k, opts }; return this; },
    single(){ singleFlag = true; return this._exec(); },
    async _exec(){
      const params = new URLSearchParams();
      params.append("select", selectCols);
      filters.forEach(f=> params.append(`filter_${f.k}`, String(f.v)));
      if(orderBy) { params.append("order", orderBy.k); params.append("orderDir", orderBy.opts?.ascending ? "asc":"desc"); }
      const url = `${API_BASE}/${table}?${params.toString()}`;
      const res = await fetch(url, { headers: { ...authHeaders(), "Content-Type":"application/json" } });
      const data = await res.json();
      return { data, error: null };
    },
    async insert(obj){
      const res = await fetch(`${API_BASE}/${table}`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type":"application/json" },
        body: JSON.stringify(obj)
      });
      return { data: await res.json(), error: null };
    },
    async update(obj){ 
      const idFilter = filters.find(f=>f.k==="id");
      const id = idFilter?.v;
      const res = await fetch(`${API_BASE}/${table}/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type":"application/json" },
        body: JSON.stringify(obj)
      });
      return { data: await res.json(), error: null };
    },
    async delete(){ 
      const idFilter = filters.find(f=>f.k==="id");
      const id = idFilter?.v;
      const res = await fetch(`${API_BASE}/${table}/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() }
      });
      return { data: await res.json(), error: null };
    }
  };
}

export const supabase = {
  auth,
  from: (table) => tableClient(table),
  storage: {
    from() { return { upload: async ()=> ({ error: null }), download: async ()=> ({ data: null }) }; }
  }
};
export default supabase;
