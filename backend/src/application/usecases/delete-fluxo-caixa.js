const deleteFluxoCaixaUseCase = async ({ fluxoCaixaRepository }, id) => {
  const removed = await fluxoCaixaRepository.remove(id);
  return Boolean(removed);
};

export default deleteFluxoCaixaUseCase;
