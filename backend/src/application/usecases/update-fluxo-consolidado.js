import createFluxoConsolidado from "../../domain/entities/fluxo-consolidado.js";

const updateFluxoConsolidadoUseCase = async ({ fluxoConsolidadoRepository }, input) => {
  const updated = await fluxoConsolidadoRepository.update({
    id: input.id,
    mesReferencia: input.mesReferencia,
    data: input.data,
    descricao: input.descricao,
    valorEstimado: input.valorEstimado,
    dataPagamento: input.dataPagamento ?? null,
    valorPagamento: input.valorPagamento ?? null
  });

  return updated ? createFluxoConsolidado(updated) : null;
};

export default updateFluxoConsolidadoUseCase;
