// src/api/userApi.js
import decoder from "@/context/token/decoder";
import {getApiRoute} from "@/import/route";
import header from "@/context/token/header";
const API_BASE = getApiRoute();

const id = decoder();

const head = header();

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/proprietarios/${id}`, {
    method: "GET",
    headers: head,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro ao buscar usuário");
  }
  return res.json();
}

export async function updateUser(payload) {
  const res = await fetch(`${API_BASE}/proprietarios/${id}`, {
    method: "PUT",
    headers: head,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro ao atualizar usuário");
  }
  return res.json();
}

export async function deleteUser() {
  const res = await fetch(`${API_BASE}/proprietarios/${id}`, {
    method: "DELETE",
    headers: head,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro ao excluir usuário");
  }
  return res.json();
}
