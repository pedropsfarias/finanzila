import createDespesa from "../../domain/entities/despesa.js";

const updateDespesaUseCase = async ({ despesasRepository }, input) => {
  const updatedDespesa = await despesasRepository.update({
    id: input.id,
    dia: input.dia,
    descricao: input.descricao,
    valorEstimado: input.valorEstimado
  });

  return updatedDespesa ? createDespesa(updatedDespesa) : null;
};

export default updateDespesaUseCase;
