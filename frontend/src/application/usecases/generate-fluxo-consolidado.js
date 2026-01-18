export const generateFluxoConsolidado = async ({ fluxoConsolidadoRepository }, payload) => {
  return fluxoConsolidadoRepository.generate(payload);
};
