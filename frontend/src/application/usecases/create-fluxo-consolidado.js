export const createFluxoConsolidado = async ({ fluxoConsolidadoRepository }, payload) => {
  return fluxoConsolidadoRepository.create(payload);
};
