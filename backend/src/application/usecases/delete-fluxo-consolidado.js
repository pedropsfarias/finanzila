const deleteFluxoConsolidadoUseCase = async ({ fluxoConsolidadoRepository }, id) => {
  const removed = await fluxoConsolidadoRepository.remove(id);
  return Boolean(removed);
};

export default deleteFluxoConsolidadoUseCase;
