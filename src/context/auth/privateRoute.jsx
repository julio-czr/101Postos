// src/auth/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  // Se não houver token, redireciona para login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Se houver token, continua
  return children;
}
