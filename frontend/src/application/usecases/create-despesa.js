export const createDespesa = async ({ despesasRepository }, payload) => {
  return despesasRepository.create(payload);
};
