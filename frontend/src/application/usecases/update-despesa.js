export const updateDespesa = async ({ despesasRepository }, { id, ...payload }) => {
  return despesasRepository.update(id, payload);
};
