const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function buscarEmpresa(cnpj) {
  const resposta = await fetch(`${API_URL}/empresas/${cnpj}`);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao buscar empresa');
  }

  return dados;
}

export async function buscarHistorico() {
  const resposta = await fetch(`${API_URL}/historico`);
  return resposta.json();
}