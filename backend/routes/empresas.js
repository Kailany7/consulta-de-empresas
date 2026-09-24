const express = require('express');
const router = express.Router();

let historico = [];
const cache = new Map();
const TEMPO_CACHE_MS = 5 * 60 * 1000; 

function cnpjValido(cnpj) {
  return /^\d{14}$/.test(cnpj);
}

router.get('/empresas/:cnpj', async (req, res) => {
  const cnpj = req.params.cnpj.replace(/\D/g, '');

  if (!cnpjValido(cnpj)) {
    return res.status(400).json({ erro: 'CNPJ deve conter 14 dígitos numéricos' });
  }

    // Verifica se os dados estão em cache e ainda são válidos
  const emCache = cache.get(cnpj);
  if (emCache && emCache.expiraEm > Date.now()) {
    return res.json(emCache.dados);
  }

  try {
    const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: {
        'User-Agent': 'consulta-empresas-cnpj/1.0 (teste-tecnico)'
      }
    });

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

    // salva no cache
    cache.set(cnpj, { dados: resultado, expiraEm: Date.now() + TEMPO_CACHE_MS });

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