import createDespesa from "../../domain/entities/despesa.js";

const listDespesasUseCase = async ({ despesasRepository }) => {
  const despesas = await despesasRepository.list();
  return despesas.map((despesa) => createDespesa(despesa));
};

export default listDespesasUseCase;
