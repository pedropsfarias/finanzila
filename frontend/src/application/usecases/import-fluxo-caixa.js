export const importFluxoCaixa = async ({ fluxoCaixaRepository }, payload) => {
  return fluxoCaixaRepository.importFromXlsx(payload);
};
