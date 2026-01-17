export const createCarteira = async ({ carteirasRepository }, payload) => {
  return carteirasRepository.create(payload);
};
