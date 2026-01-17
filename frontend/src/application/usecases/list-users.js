export const listUsers = async ({ usersRepository }) => {
  return usersRepository.list();
};
