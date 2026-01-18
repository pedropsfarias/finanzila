const deleteDespesaUseCase = async ({ despesasRepository }, id) => {
  const removed = await despesasRepository.remove(id);
  return Boolean(removed);
};

export default deleteDespesaUseCase;
