// src/components/UserEditForm.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PerfilConfig.module.css"; 
import Sidebar from "@/view/ui/sidebar/Sidebar";
import { getCurrentUser, updateUser, deleteUser } from "@/api/userApi";

export default function UserEditForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "", // deixe vazio se não for mudar
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getCurrentUser()
      .then((data) => {
        if (!mounted) return;
        // ajuste os campos conforme a resposta da sua API
        setForm({
          name: data.nome || "",
          email: data.email || "",
          password: "", // não preencher senha por segurança
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar usuário:", err);
        setError("Não foi possível carregar os dados do usuário.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // prepare payload: não envie password se estiver vazio
      const payload = { nome: form.name, email: form.email };
      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

      const updated = await updateUser(payload);
      setSuccess("Dados atualizados com sucesso.");
      // opcional: atualizar token se a API retornar um novo token
      if (updated.token) {
        localStorage.setItem("token", updated.token);
      }
      // limpar a senha do formulário por segurança
      setForm((s) => ({ ...s, password: "" }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao atualizar usuário.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
    );
    if (!ok) return;

    try {
      setLoading(true);
      await deleteUser();
      // limpar token e redirecionar para login/landing
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao excluir usuário.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles["perfil-body"]}>
        <Sidebar />
        <div className={styles["perfil-container"]}>
          <div className={styles["perfil-card"]}>
            <p>Carregando dados do usuário...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["perfil-body"]}>
      <Sidebar />
      <div className={styles["perfil-container"]}>
        
        <div className={styles["perfil-card"]}>
          <h1>Editar perfil</h1>

          {error && <p style={{ color: "var(--danger, #b00020)" }}>{error}</p>}
          {success && <p style={{ color: "var(--success, #006400)" }}>{success}</p>}

          <form onSubmit={handleSave} className={styles["perfil-form"]}>
            <div className={styles["form-group"]}>
              <label>Nome</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>

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
              <label>Senha (deixe em branco para não alterar)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="submit"
                className={styles["perfil-button"]}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className={styles["perfil-button"]}
                disabled={loading}
              >
                {loading ? "Processando..." : "Excluir conta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
