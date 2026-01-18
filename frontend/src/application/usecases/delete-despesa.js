export const deleteDespesa = async ({ despesasRepository }, id) => {
  await despesasRepository.remove(id);
  return true;
};
