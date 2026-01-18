export const deleteCarteira = async ({ carteirasRepository }, id) => {
  await carteirasRepository.remove(id);
  return true;
};
