const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const authService = {
  loginMorador: (email, senha) =>
    request('/auth/morador/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  loginSindico: (email, senha) =>
    request('/auth/sindico/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

    recuperarSenhaMorador: (email) =>
    request('/auth/morador/recuperar', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  recuperarSenhaSindico: (email) =>
    request('/auth/sindico/recuperar', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export const chamadosService = {
  listarPorMorador: (moradorId) =>
    request(`/chamados/morador/${moradorId}`),

  listarTodos: () =>
    request('/chamados'),

  criar: (dados) =>
    request('/chamados', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizarStatus: (id, status) =>
    request(`/chamados/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify( status ),
    }),

  atribuirResponsavel: (id, responsavelId) =>
    request(`/chamados/${id}/responsavel`, {
      method: 'PATCH',
      body: JSON.stringify({ responsavelId }),
    }),
};

export const moradoresService = {
  buscarPorId: (id) => request(`/moradores/${id}`),

  criar: (dados) =>
    request('/moradores', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),
};

export const sindicosService = {
  listarTodos: () => request('/sindicos-zeladores'),
};