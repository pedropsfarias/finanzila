import createFluxoConsolidado from "../../domain/entities/fluxo-consolidado.js";

const createFluxoConsolidadoUseCase = async ({ fluxoConsolidadoRepository }, input) => {
  const saved = await fluxoConsolidadoRepository.create({
    mesReferencia: input.mesReferencia,
    data: input.data,
    descricao: input.descricao,
    valorEstimado: input.valorEstimado,
    dataPagamento: input.dataPagamento ?? null,
    valorPagamento: input.valorPagamento ?? null
  });

  return createFluxoConsolidado(saved);
};

export default createFluxoConsolidadoUseCase;
