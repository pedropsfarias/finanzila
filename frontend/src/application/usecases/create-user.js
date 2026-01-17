export const createUser = async ({ usersRepository }, payload) => {
  return usersRepository.create(payload);
};
