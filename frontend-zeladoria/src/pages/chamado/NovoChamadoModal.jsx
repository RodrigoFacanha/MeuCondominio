import { useState } from 'react';
import { chamadosService } from '../../services/api';
import './NovoChamadoModal.css';

export default function NovoChamadoModal({ moradorId, onClose, onSucesso }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!titulo.trim() || !descricao.trim() || !local.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    try {
      await chamadosService.criar({
        titulo,
        descricao,
        localOcorrencia: local,
        moradorId,
      });
      onSucesso();
    } catch (err) {
      setErro(err.message || 'Erro ao criar chamado.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal-header">
          <h2 className="modal-titulo" id="modal-titulo">Novo Chamado</h2>
          <button className="modal-fechar" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="modal-field">
            <label className="modal-label" htmlFor="m-titulo">Título</label>
            <input
              id="m-titulo"
              className="modal-input"
              type="text"
              placeholder="Ex: Lâmpada queimada no corredor"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="m-local">Local de ocorrência</label>
            <input
              id="m-local"
              className="modal-input"
              type="text"
              placeholder="Ex: Corredor do 3º andar"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="m-desc">Descrição</label>
            <textarea
              id="m-desc"
              className="modal-input modal-textarea"
              rows={4}
              placeholder="Descreva o problema com detalhes…"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {erro && <p className="modal-erro" role="alert">{erro}</p>}

          <div className="modal-actions">
            <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn--submit" disabled={salvando}>
              {salvando ? 'Enviando…' : 'Abrir Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
