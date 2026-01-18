export const updateFluxoCaixa = async ({ fluxoCaixaRepository }, { id, ...payload }) => {
  return fluxoCaixaRepository.update(id, payload);
};
