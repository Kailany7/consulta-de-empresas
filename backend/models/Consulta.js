const mongoose = require('mongoose');

const consultaSchema = new mongoose.Schema({
  cnpj: { type: String, required: true },
  razaoSocial: String,
  nomeFantasia: String,
  situacao: String,
  cnae: String,
  dataAbertura: String,
  endereco: String,
  consultadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consulta', consultaSchema);