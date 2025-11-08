import React from 'react';
import './Shelf.css';

// Exemplo de dados de estabelecimentos e áreas
const estabelecimentos = [
    {
        id: 1,
        nome: 'Posto Central',
        areas: ['Loja', 'Bomba', 'Escritório'],
    },
    {
        id: 2,
        nome: 'Posto Norte',
        areas: ['Loja', 'Bomba'],
    },
    {
        id: 3,
        nome: 'Posto Norte',
        areas: ['Loja', 'Bomba',' Oficina', 'Café','Lava Rápido'],
    },
   
];

// Card para área do estabelecimento
function AreaCard({ area }) {
    return <button className="area-card">{area}</button>;
}

// Container para um estabelecimento
function EstabelecimentoContainer({ estabelecimento }) {
    return (
        <div className="estabelecimento-container">
            <div className="estabelecimento-nome">{estabelecimento.nome}</div>
            <div className="areas-container">
                {estabelecimento.areas.map((area, idx) => (
                    <AreaCard key={idx} area={area} />
                ))}
            </div>
        </div>
    );
}

// Shelf principal
export default function Shelf() {
    return (
        <div className="shelf">
            {estabelecimentos.map(estab => (
                <EstabelecimentoContainer key={estab.id} estabelecimento={estab} />
            ))}
        </div>
    );
}
