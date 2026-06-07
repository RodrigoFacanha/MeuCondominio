import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadosService } from '../../services/api';
import './SindicoHome.css';

const STATUS_META = {
  ABERTO:       { label: 'Aberto',       cls: 'status-aberto' },
  EM_ANDAMENTO: { label: 'Em andamento', cls: 'status-andamento' },
  CONCLUIDO:    { label: 'Concluído',    cls: 'status-concluido' },
  CANCELADO:    { label: 'Cancelado',    cls: 'status-cancelado' },
};

const STATUS_OPTIONS = ['ABERTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'];

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? { label: status, cls: '' };
  return <span className={`status-badge ${meta.cls}`}>{meta.label}</span>;
}

export default function SindicoHome() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // filtros
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroBusca, setFiltroBusca] = useState('');

  // status inline editing
  const [atualizando, setAtualizando] = useState(null); // id do chamado sendo atualizado

  const carregarChamados = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const data = await chamadosService.listarTodos();
      setChamados(data);
    } catch (err) {
      setErro('Não foi possível carregar os chamados.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarChamados(); }, [carregarChamados]);

  async function handleStatusChange(id, novoStatus) {
    setAtualizando(id);
    try {
      await chamadosService.atualizarStatus(id, novoStatus);
      setChamados((prev) =>
        prev.map((c) => c.id === id ? { ...c, status: novoStatus } : c)
      );
    } catch {
      setErro('Erro ao atualizar status.');
    } finally {
      setAtualizando(null);
    }
  }

  function handleSair() {
    localStorage.clear();
    navigate('/');
  }

  // Filtragem local
  const chamadosFiltrados = chamados.filter((c) => {
    const matchStatus = !filtroStatus || c.status === filtroStatus;
    const termo = filtroBusca.toLowerCase();
    const matchBusca =
      !termo ||
      c.titulo?.toLowerCase().includes(termo) ||
      c.morador?.nome?.toLowerCase().includes(termo) ||
      c.localOcorrencia?.toLowerCase().includes(termo) ||
      c.local_ocorrencia?.toLowerCase().includes(termo);
    return matchStatus && matchBusca;
  });

  const contadores = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = chamados.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <div className="sh-root">

      {/* ── Header ── */}
      <header className="sh-header">
        <div className="sh-header-inner">
          <div className="sh-brand">
            <span className="sh-brand-icon" aria-hidden="true">⚙</span>
            <span className="sh-brand-name">Meu Condominio</span>
            <span className="sh-brand-role">Painel do Síndico</span>
          </div>
          <div className="sh-header-right">
            <span className="sh-usuario">{usuario.nome ?? 'Síndico'}</span>
            <button className="sh-btn-sair" onClick={handleSair}>Sair</button>
          </div>
        </div>
      </header>

      <main className="sh-main">

        {/* ── KPI strip ── */}
        <div className="sh-kpis">
          {STATUS_OPTIONS.map((s) => {
            const meta = STATUS_META[s];
            return (
              <button
                key={s}
                className={`sh-kpi${filtroStatus === s ? ' sh-kpi--active' : ''}`}
                onClick={() => setFiltroStatus(filtroStatus === s ? '' : s)}
              >
                <span className={`sh-kpi-num ${meta.cls}`}>{contadores[s]}</span>
                <span className="sh-kpi-label">{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Toolbar ── */}
        <div className="sh-toolbar">
          <div>
            <h1 className="sh-page-title">Todos os Chamados</h1>
            <p className="sh-page-sub">
              {chamadosFiltrados.length} de {chamados.length} chamados
            </p>
          </div>
          <div className="sh-filters">
            <input
              className="sh-search"
              type="search"
              placeholder="Buscar por título, morador ou local…"
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
            />
            <select
              className="sh-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
            <button className="sh-btn-refresh" onClick={carregarChamados} title="Atualizar">
              ↻
            </button>
          </div>
        </div>

        {erro && <p className="sh-erro">{erro}</p>}

        {/* ── Tabela ── */}
        {carregando ? (
          <div className="sh-loading">
            <span className="sh-spinner" aria-label="Carregando" />
            Carregando chamados…
          </div>
        ) : (
          <div className="sh-table-wrap">
            <table className="sh-table">
              <thead>
                <tr>
                  <th className="sh-th sh-th--id">#</th>
                  <th className="sh-th">Título</th>
                  <th className="sh-th">Morador</th>
                  <th className="sh-th">Unidade</th>
                  <th className="sh-th">Local</th>
                  <th className="sh-th">Status</th>
                  <th className="sh-th sh-th--action">Alterar Status</th>
                </tr>
              </thead>
              <tbody>
                {chamadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="sh-td sh-empty-row">
                      Nenhum chamado encontrado.
                    </td>
                  </tr>
                ) : (
                  chamadosFiltrados.map((c) => (
                    <tr key={c.id} className="sh-tr">
                      <td className="sh-td sh-td--id">#{c.id}</td>
                      <td className="sh-td sh-td--titulo">{c.titulo}</td>
                      <td className="sh-td">{c.morador?.nome ?? '—'}</td>
                      <td className="sh-td sh-td--unidade">{c.morador?.unidade ?? '—'}</td>
                      <td className="sh-td">{c.localOcorrencia ?? c.local_ocorrencia ?? '—'}</td>
                      <td className="sh-td">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="sh-td sh-td--action">
                        <select
                          className="sh-status-select"
                          value={c.status}
                          disabled={atualizando === c.id}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{STATUS_META[s].label}</option>
                          ))}
                        </select>
                        {atualizando === c.id && (
                          <span className="sh-inline-spinner" aria-label="Salvando" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
