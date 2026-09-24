export default function ResultadoEmpresa({ resultado, carregando, erro }) {
  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p className="erro">{erro}</p>;
  }

  if (!resultado) {
    return null;
  }

  return (
    <div className="resultado">
      <h2>{resultado.razaoSocial}</h2>
      <p><strong>Nome fantasia:</strong> {resultado.nomeFantasia}</p>
      <p><strong>Situação:</strong> {resultado.situacao}</p>
      <p><strong>CNAE:</strong> {resultado.cnae}</p>
      <p><strong>Data de abertura:</strong> {resultado.dataAbertura}</p>
      <p><strong>Endereço:</strong> {resultado.endereco}</p>
    </div>
  );
}