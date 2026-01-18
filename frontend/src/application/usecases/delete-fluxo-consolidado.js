export const deleteFluxoConsolidado = async ({ fluxoConsolidadoRepository }, id) => {
  await fluxoConsolidadoRepository.remove(id);
};
