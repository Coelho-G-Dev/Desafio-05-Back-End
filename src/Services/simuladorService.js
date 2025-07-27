import UnidadeSaude from '../models/UnidadeSaude.js';
import RequisicaoAtendimento from '../models/RequisicaoAtendimento.js';

let simuladorIntervalId = null;

export  async function iniciarSimulacao() {
    if (simuladorIntervalId) {
      console.log('O simulador já está em execução.');
      return;
    }
  
    console.log('Iniciando simulador de lotação...');
    
    const unidades = await UnidadeSaude.find().select('_id categoria');
    if (unidades.length === 0) {
      console.log('Nenhuma unidade de saúde encontrada no banco. Execute o seeder primeiro.');
      return;
    }
  
    simuladorIntervalId = setInterval(() => {
      const unidadeAleatoria = unidades[Math.floor(Math.random() * unidades.length)];
      const chance = Math.random();
      let registrar = false;
  
      if (unidadeAleatoria.categoria === 'UPA' && chance < 0.6) registrar = true;
      else if (unidadeAleatoria.categoria === 'Hospital' && chance < 0.5) registrar = true;
      else if (unidadeAleatoria.categoria === 'Posto de Saúde' && chance < 0.3) registrar = true;
      
      if (registrar) {
        // Alteração aqui para usar seu modelo e nome de campo
        const novaRequisicao = new RequisicaoAtendimento({
          unidadeSaude: unidadeAleatoria._id,
        });
        novaRequisicao.save();
        console.log(`[Simulador] Nova requisição registrada para a unidade ID: ${unidadeAleatoria._id}`);
      }
  
    }, 20000);
  }

export  function pararSimulacao() {
  if (!simuladorIntervalId) {
    console.log('O simulador não está em execução.');
    return;
  }
  clearInterval(simuladorIntervalId);
  simuladorIntervalId = null;
  console.log('Simulador de lotação parado.');
}

export  function getStatus() {
  return {
    rodando: simuladorIntervalId !== null,
  };
}

