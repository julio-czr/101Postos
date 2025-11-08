import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/api/userApi";


export default function Sidebar({
    buttonHomeLabel = "Início",
    buttonUserLabel = "Editar Perfil",
    buttonConfigBusinessLabel = "Estabelecimento",
    buttonConfigLabel = "Configurações",
    buttonExitLabel = "Sair",
    
}) {

    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({
        image: "https://ui-avatars.com/api/?name=...",
        name: "Carregando...",
    });
    const navigate = useNavigate();

    function onButtonHomeClick (){  navigate("/dashboard");}
    function onButtonUserClick (){  navigate("/dashboard/perfil");}
    function onButtonConfigBusinessClick (){  navigate("/dashboard/estabelecimento");}
    function onButtonConfigClick(){ navigate("/dashboard/config");}
    function onButtonExitClick(){ 
        console.log("Saindo...");
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getCurrentUser();
                console.log("Dados do usuário:", data);
                setUser({
                    name: data.nome,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nome)}`,
                });
            } catch (err) {
                console.error("Erro ao buscar usuário:", err);
            }
        }
        fetchUser();
    }, []);

    return (
        <>
            <button
                className={styles["sb-toggle"]}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
                ⋯
            </button>

            <aside className={`${styles.sb} ${open ? styles.open : ""}`}>
                <div className={styles["sb-inner"]}>
                    <img className={styles["sb-avatar"]} src={user.image} alt={`Foto de ${name}`} />
                    <div className={styles["sb-name"]}>{user.name}</div>
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonHomeClick();
                            setOpen(false);
                        }}
                    >
                        {buttonHomeLabel}
                    </button>
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonUserClick();
                            setOpen(false);
                        }}
                    >
                        {buttonUserLabel}
                    </button>
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonConfigBusinessClick();
                            setOpen(false);
                        }}
                    >
                        {buttonConfigBusinessLabel}
                    </button>

                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonConfigClick();
                            setOpen(false);
                        }}
                    >
                        {buttonConfigLabel}
                    </button>
                    
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonExitClick();
                            setOpen(false);
                        }}
                    >
                        {buttonExitLabel}
                    </button>
                </div>
            </aside>

            <div
                className={`${styles["sb-backdrop"]} ${open ? styles.show : ""}`}
                onClick={() => setOpen(false)}
            />
        </>
    );


}
