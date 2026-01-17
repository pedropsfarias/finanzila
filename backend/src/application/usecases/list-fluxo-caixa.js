import createFluxoCaixa from "../../domain/entities/fluxo-caixa.js";

const listFluxoCaixaUseCase = async ({ fluxoCaixaRepository }) => {
  const fluxos = await fluxoCaixaRepository.list();
  return fluxos.map((fluxo) => createFluxoCaixa(fluxo));
};

export default listFluxoCaixaUseCase;
