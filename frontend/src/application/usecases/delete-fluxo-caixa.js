export const deleteFluxoCaixa = async ({ fluxoCaixaRepository }, id) => {
  await fluxoCaixaRepository.remove(id);
  return true;
};
