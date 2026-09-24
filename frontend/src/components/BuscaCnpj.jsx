import { useState } from 'react';
import { formatarCnpj, limparCnpj } from '../utils/formatarCnpj';

export default function BuscaCnpj({ onBuscar }) {
  const [cnpj, setCnpj] = useState('');

  function handleChange(e) {
    setCnpj(formatarCnpj(e.target.value));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onBuscar(limparCnpj(cnpj));
  }

  return (
    <form onSubmit={handleSubmit} className="busca-form">
      <input
        type="text"
        placeholder="00.000.000/0000-00"
        value={cnpj}
        onChange={handleChange}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}