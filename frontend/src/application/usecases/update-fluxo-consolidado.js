export const updateFluxoConsolidado = async ({ fluxoConsolidadoRepository }, { id, ...payload }) => {
  return fluxoConsolidadoRepository.update(id, payload);
};
