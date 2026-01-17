import createFluxoCaixa from "../../domain/entities/fluxo-caixa.js";

const createFluxoCaixaUseCase = async ({ fluxoCaixaRepository }, input) => {
  const savedFluxo = await fluxoCaixaRepository.create({
    data: input.data,
    descricao: input.descricao,
    valor: input.valor,
    parcela: input.parcela,
    carteiraId: input.carteiraId
  });

  return createFluxoCaixa(savedFluxo);
};

export default createFluxoCaixaUseCase;
