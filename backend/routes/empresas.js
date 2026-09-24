const express = require('express');
const router = express.Router();

let historico = [];

function cnpjValido(cnpj) {
  return /^\d{14}$/.test(cnpj);
}

router.get('/empresas/:cnpj', async (req, res) => {
  const cnpj = req.params.cnpj.replace(/\D/g, '');

  if (!cnpjValido(cnpj)) {
    return res.status(400).json({ erro: 'CNPJ deve conter 14 dígitos numéricos' });
  }

  try {
    const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

    if (resposta.status === 404) {
      return res.status(404).json({ erro: 'CNPJ não encontrado' });
    }

    if (!resposta.ok) {
      return res.status(502).json({ erro: 'Falha ao consultar a BrasilAPI' });
    }

    const dados = await resposta.json();

    const resultado = {
      cnpj,
      razaoSocial: dados.razao_social,
      nomeFantasia: dados.nome_fantasia || '—',
      situacao: dados.descricao_situacao_cadastral,
      cnae: dados.cnae_fiscal_descricao,
      dataAbertura: dados.data_inicio_atividade,
      endereco: `${dados.logradouro}, ${dados.numero} - ${dados.bairro}, ${dados.municipio}/${dados.uf}`
    };

    historico.unshift(resultado);
    historico = historico.slice(0, 5);

    res.json(resultado);

  } catch (erro) {
    res.status(503).json({ erro: 'Não foi possível conectar à BrasilAPI' });
  }
});

router.get('/historico', (req, res) => {
  res.json(historico);
});

module.exports = router;