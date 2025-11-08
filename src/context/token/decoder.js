function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}

// uso simples
export default function getUserIdFromToken() {
    const token = localStorage.getItem("token");

    if (token) {
    const decoded = parseJwt(token);
    if (decoded) {
        console.log("ID do usuário:", decoded.id);
        console.log("Email do usuário:", decoded.email);
        return decoded.id;
    }
    } else {
    console.log("Token não encontrado no localStorage");
    }

}

