const createFluxoCaixa = ({ id, data, descricao, valor, parcela, carteiraId, criadoEm, atualizadoEm }) => ({
  id,
  data,
  descricao,
  valor,
  parcela,
  carteiraId,
  criadoEm,
  atualizadoEm
});

export default createFluxoCaixa;
