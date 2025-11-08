import { useState } from "react";
import { loginUser } from "@/api/loginApi";
import logo from "@/assets/logo.png";
import styles from "./Login.module.css";
import { useNavigate } from 'react-router-dom';


export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);
      console.log("Login bem-sucedido:", data);
      localStorage.setItem("token", data.token);
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError("Email ou senha incorretos!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-card"]}>
        <img src={logo} alt="Logo do posto" className={styles["login-logo"]} />
        <h1>Bem-vindo(a)</h1>
        <p className={styles["subtitle"]}>Acesse sua conta para continuar</p>

        <form onSubmit={handleSubmit} className={styles["login-form"]}>
          <div className={styles["form-group"]}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemplo@posto.com"
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles["login-button"]}>
            Entrar
          </button>
        </form>

        <a href="#" className={styles["forgot-password"]}>
          Esqueceu sua senha?
        </a>
      </div>
    </div>
  );
}
