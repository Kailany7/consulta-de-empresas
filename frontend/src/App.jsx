import { useState } from 'react';
import BuscaCnpj from './components/BuscaCnpj';
import ResultadoEmpresa from './components/ResultadoEmpresa';
import Historico from './components/Historico';

function App() {
  const [estado, setEstado] = useState('vazio'); // vazio | carregando | erro | sucesso
  const [ultimoCnpjBuscado, setUltimoCnpjBuscado] = useState('');

  const resultadoFalso = {
    razaoSocial: 'EMPRESA TESTE LTDA',
    nomeFantasia: 'Teste',
    situacao: 'ATIVA',
    cnae: 'Testes de software',
    dataAbertura: '2020-01-01',
    endereco: 'Rua Teste, 123 - Centro, São Paulo/SP'
  };

  const historicoFalso = [
    { razaoSocial: 'EMPRESA TESTE LTDA', cnpj: '00.000.000/0000-00' },
    { razaoSocial: 'OUTRA EMPRESA LTDA', cnpj: '11.111.111/1111-11' }
  ];

  function handleBuscar(cnpj) {
    console.log('CNPJ recebido no App:', cnpj);
    setUltimoCnpjBuscado(cnpj);
  }

  return (
    <div>
      <BuscaCnpj onBuscar={handleBuscar} />
      <p>Último CNPJ buscado (sem formatação): {ultimoCnpjBuscado}</p>

      <hr />

      <button onClick={() => setEstado('carregando')}>Simular carregando</button>
      <button onClick={() => setEstado('erro')}>Simular erro</button>
      <button onClick={() => setEstado('sucesso')}>Simular sucesso</button>

      <ResultadoEmpresa
        carregando={estado === 'carregando'}
        erro={estado === 'erro' ? 'CNPJ não encontrado' : null}
        resultado={estado === 'sucesso' ? resultadoFalso : null}
      />
      <Historico consultas={historicoFalso} />
    </div>
  );
}

export default App;