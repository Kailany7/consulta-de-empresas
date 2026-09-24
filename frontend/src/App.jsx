import { useState, useEffect } from 'react';
import BuscaCnpj from './components/BuscaCnpj';
import ResultadoEmpresa from './components/ResultadoEmpresa';
import Historico from './components/Historico';
import { buscarEmpresa, buscarHistorico } from './services/api';
import './App.css';

function App() {
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [historico, setHistorico] = useState([]);

  async function atualizarHistorico() {
    try {
      const dados = await buscarHistorico();
      setHistorico(dados);
    } catch {
      // histórico não é crítico, falha silenciosa
    }
  }

  useEffect(() => {
    async function carregar() {
      await atualizarHistorico();
    }
    carregar();
  }, []);

  async function handleBuscar(cnpj) {
    setCarregando(true);
    setErro(null);
    setResultado(null);

    try {
      const dados = await buscarEmpresa(cnpj);
      setResultado(dados);
      atualizarHistorico();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    //PicoCSS,exige que o conteúdo principal esteja dentro de uma tag <main>
    <main className="container"> 
      <h1>Consulta de Empresas</h1>

      <BuscaCnpj onBuscar={handleBuscar} />

      <ResultadoEmpresa
        resultado={resultado}
        carregando={carregando}
        erro={erro}
      />

      <Historico consultas={historico} />
    </main>
  );
}

export default App;