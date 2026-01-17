export const listCarteiras = async ({ carteirasRepository }) => {
  return carteirasRepository.list();
};
