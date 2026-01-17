export const createFluxoCaixa = async ({ fluxoCaixaRepository }, payload) => {
  return fluxoCaixaRepository.create(payload);
};
