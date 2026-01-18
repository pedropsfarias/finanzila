export const updateCarteira = async ({ carteirasRepository }, { id, ...payload }) => {
  return carteirasRepository.update(id, payload);
};
