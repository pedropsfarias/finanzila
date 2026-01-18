export const listFluxoConsolidado = async ({ fluxoConsolidadoRepository }, params = {}) => {
  return fluxoConsolidadoRepository.list(params);
};
