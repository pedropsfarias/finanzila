export const updateUser = async ({ usersRepository }, { id, ...payload }) => {
  return usersRepository.update(id, payload);
};
