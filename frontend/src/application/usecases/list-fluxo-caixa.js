export const listFluxoCaixa = async ({ fluxoCaixaRepository }) => {
  return fluxoCaixaRepository.list();
};
