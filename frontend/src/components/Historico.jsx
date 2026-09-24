export default function Historico({ consultas }) {
  if (!consultas || consultas.length === 0) {
    return null;
  }

  return (
    <div className="historico">
      <h3>Últimas consultas</h3>
      <ul>
        {consultas.map((item) => (
          <li key={item._id}>
            <span className="historico-razao">{item.razaoSocial}</span>
            <span className="historico-cnpj">{item.cnpj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}