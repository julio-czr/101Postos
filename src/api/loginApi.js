
import {getApiRoute} from "../import/route";
const ROUTE =  getApiRoute();
export async function loginUser({ email, password }) {
  const response = await fetch(ROUTE+"/login", {
    method: "POST",
    headers: { 
          "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha: password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro no login");
  }
  
  return response.json();
}

