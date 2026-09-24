export default function Historico({ consultas }) {
  if (!consultas || consultas.length === 0) {
    return null;
  }

  return (
    <div className="historico">
      <h3>Últimas consultas</h3>
      <ul>
        {consultas.map((item, index) => (
          <li key={index}>
            {item.razaoSocial} — {item.cnpj}
          </li>
        ))}
      </ul>
    </div>
  );
}