const deleteCarteiraUseCase = async ({ carteirasRepository }, id) => {
  const removed = await carteirasRepository.remove(id);
  return Boolean(removed);
};

export default deleteCarteiraUseCase;
