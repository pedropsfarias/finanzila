import createDespesa from "../../domain/entities/despesa.js";

const createDespesaUseCase = async ({ despesasRepository }, input) => {
  const savedDespesa = await despesasRepository.create({
    dia: input.dia,
    descricao: input.descricao,
    valorEstimado: input.valorEstimado
  });

  return createDespesa(savedDespesa);
};

export default createDespesaUseCase;
