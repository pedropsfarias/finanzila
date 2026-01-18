import createFluxoConsolidado from "../../domain/entities/fluxo-consolidado.js";

const listFluxoConsolidadoUseCase = async ({ fluxoConsolidadoRepository }, input = {}) => {
  const fluxos = await fluxoConsolidadoRepository.list({ mesReferencia: input.mesReferencia });
  return fluxos.map((fluxo) => createFluxoConsolidado(fluxo));
};

export default listFluxoConsolidadoUseCase;
