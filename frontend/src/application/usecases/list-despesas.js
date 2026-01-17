export const listDespesas = async ({ despesasRepository }) => {
  return despesasRepository.list();
};
