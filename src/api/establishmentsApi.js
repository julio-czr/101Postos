// src/services/estabelecimentosApi.js
import { getApiRoute } from "@/import/route";
import header from "@/context/token/header";
import getIdProprietario from "@/context/token/decoder";

const baseURL = getApiRoute();
const head = header();

// Note: decoder() pode retornar null/undefined se não estiver logado.
// Ajuste conforme a sua lógica de autenticação.

export async function getAllEstabelecimentos() {
  const res = await fetch(`${baseURL}/estabelecimentos`, {
    headers: head,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(txt || "Falha ao carregar estabelecimentos");
  }
  return res.json();
}

export async function getEstabelecimentoById(id) {
  const res = await fetch(`${baseURL}/estabelecimentos/${id}`, {
    headers: head,
  });
  if (!res.ok) throw new Error("Falha ao carregar estabelecimento");
  return res.json();
}

export async function createEstabelecimento(payload) {
  // garante que enviamos id_proprietario
  const id_proprietario = getIdProprietario();
  const body = { ...payload, id_proprietario };
  const res = await fetch(`${baseURL}/estabelecimentos`, {
    method: "POST",
    headers: head,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error((json && (json.error || json.message)) || "Falha ao criar estabelecimento");
  }
  return res.json(); // controller retorna { message, estabelecimento }
}

export async function updateEstabelecimento(id, payload) {
  const res = await fetch(`${baseURL}/estabelecimentos/${id}`, {
    method: "PUT",
    headers: head,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error((json && (json.error || json.message)) || "Falha ao atualizar estabelecimento");
  }
  return res.json(); // controller retorna { message, estabelecimento }
}

export async function deleteEstabelecimento(id) {
  const res = await fetch(`${baseURL}/estabelecimentos/${id}`, {
    method: "DELETE",
    headers: head,
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error((json && (json.error || json.message)) || "Falha ao excluir estabelecimento");
  }
  return res.json(); // { message }
}
