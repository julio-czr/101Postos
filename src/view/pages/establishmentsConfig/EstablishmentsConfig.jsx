import React, { useEffect, useState } from "react";
import Sidebar from "@/view/ui/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import styles from "./EstablishmentsConfig.module.css";

import {
  getAllEstabelecimentos,
  createEstabelecimento,
  updateEstabelecimento,
  deleteEstabelecimento,
} from "@/api/establishmentsApi";

import decoder from "@/context/token/decoder";

// componente
export default function EstablishmentsConfig() {
  const navigate = useNavigate();
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // estado do formulário (padronizado com o model)
  const emptyCurrent = {
    id_estabelecimento: null,
    nome_fantasia: "",
    cnpj: "",
    endereco: "",
    telefone: "",
  };
  const [current, setCurrent] = useState(emptyCurrent);

  const id_proprietario = decoder(); // usado somente para info, create envia automaticamente via service

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getAllEstabelecimentos()
      .then((data) => {
        if (!mounted) return;
        // controller retorna array direto
        setEstablishments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Erro ao carregar estabelecimentos");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  function openCreate() {
    setCurrent({ ...emptyCurrent });
    setModalOpen(true);
    setError("");
  }

  function openEdit(est) {
    setCurrent({
      id_estabelecimento: est.id_estabelecimento ?? est.id ?? est._id ?? null,
      nome_fantasia: est.nome_fantasia ?? "",
      cnpj: est.cnpj ?? "",
      endereco: est.endereco ?? "",
      telefone: est.telefone ?? "",
    });
    setModalOpen(true);
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        nome_fantasia: current.nome_fantasia,
        cnpj: current.cnpj || null,
        endereco: typeof current.endereco !== "undefined" ? current.endereco : null,
        telefone: typeof current.telefone !== "undefined" ? current.telefone : null,
        // não enviamos id_proprietario aqui: a service de create injeta decoder()
        // para update, se quiser mudar id_proprietario, inclua-o manualmente no payload
      };

      if (current.id_estabelecimento) {
        const res = await updateEstabelecimento(current.id_estabelecimento, payload);
        // controller retorna { message, estabelecimento }
        const updated = res.estabelecimento ?? res;
        setEstablishments((s) =>
          s.map((it) =>
            (it.id_estabelecimento === current.id_estabelecimento || it.id === current.id_estabelecimento) ? updated : it
          )
        );
      } else {
        const res = await createEstabelecimento(payload);
        // controller retorna { message, estabelecimento }
        const created = res.estabelecimento ?? res;
        // alguns controllers retornam o objeto dentro de "estabelecimento"
        setEstablishments((s) => [created, ...s]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao salvar estabelecimento");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Excluir este estabelecimento? Esta ação não pode ser desfeita.");
    if (!ok) return;
    try {
      await deleteEstabelecimento(id);
      setEstablishments((s) => s.filter((it) => (it.id_estabelecimento || it.id || it._id) !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao excluir estabelecimento");
    }
  }

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Configurações de Estabelecimentos</h1>
              <p className={styles.subtitle}>Crie e gerencie seus estabelecimentos. Você pode ter vários.</p>
              {/* {id_proprietario && <p className={styles.small}>Proprietário: {id_proprietario}</p>} */}
            </div>

            <div className={styles.actions}>
              <button onClick={openCreate} className={styles.btnPrimary}>+ Novo estabelecimento</button>
              {/* <button onClick={() => navigate(-1)} className={styles.btnGhost}>Voltar</button> */}
            </div>
          </div>

          <hr className={styles.divider} />

          {error && <p className={styles.error}>{error}</p>}

          {loading ? (
            <p>Carregando estabelecimentos...</p>
          ) : (
            <div className={styles.grid}>
              {establishments.length === 0 && (
                <div className={styles.empty}>Nenhum estabelecimento encontrado. Crie o primeiro!</div>
              )}

              {establishments.map((est) => {
                const id = est.id_estabelecimento ?? est.id ?? est._id;
                return (
                  <div key={id} className={styles.estCard}>
                    <div>
                      <h2 className={styles.estName}>{est.nome_fantasia ?? "Sem nome"}</h2>
                      <p className={styles.estInfo}>{est.cnpj ?? "-"}</p>
                      <p className={styles.estInfo}>{est.endereco ?? "-"}</p>
                      <p className={styles.estInfo}>{est.telefone ?? "-"}</p>
                    </div>

                    <div className={styles.cardActions}>
                      <button onClick={() => openEdit(est)} className={styles.btnEdit}>Editar</button>
                      <button onClick={() => handleDelete(id)} className={styles.btnDelete}>Excluir</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>{current.id_estabelecimento ? "Editar estabelecimento" : "Novo estabelecimento"}</h3>
            <form onSubmit={handleSave} className={styles.form}>
              <label className={styles.label}>Nome</label>
              <input
                required
                value={current.nome_fantasia}
                onChange={(e) => setCurrent((s) => ({ ...s, nome_fantasia: e.target.value }))}
                className={styles.input}
              />

              <label className={styles.label}>CNPJ</label>
              <input
                value={current.cnpj}
                onChange={(e) => setCurrent((s) => ({ ...s, cnpj: e.target.value }))}
                className={styles.input}
              />

              <label className={styles.label}>Endereço</label>
              <input
                value={current.endereco}
                onChange={(e) => setCurrent((s) => ({ ...s, endereco: e.target.value }))}
                className={styles.input}
              />

              <label className={styles.label}>Telefone</label>
              <input
                value={current.telefone}
                onChange={(e) => setCurrent((s) => ({ ...s, telefone: e.target.value }))}
                className={styles.input}
              />

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setModalOpen(false)} className={styles.btnCancel}>Cancelar</button>
                <button type="submit" disabled={saving} className={styles.btnSave}>{saving ? "Salvando..." : "Salvar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
