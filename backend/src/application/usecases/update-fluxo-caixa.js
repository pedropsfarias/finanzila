import createFluxoCaixa from "../../domain/entities/fluxo-caixa.js";

const updateFluxoCaixaUseCase = async ({ fluxoCaixaRepository }, input) => {
  const updatedFluxo = await fluxoCaixaRepository.update({
    id: input.id,
    data: input.data,
    descricao: input.descricao,
    valor: input.valor,
    parcela: input.parcela ?? null,
    carteiraId: input.carteiraId
  });

  return updatedFluxo ? createFluxoCaixa(updatedFluxo) : null;
};

export default updateFluxoCaixaUseCase;
