const createFluxoCaixa = ({ id, data, descricao, valor, parcela, carteiraId }) => ({
  id,
  data,
  descricao,
  valor,
  parcela,
  carteiraId
});

export default createFluxoCaixa;
