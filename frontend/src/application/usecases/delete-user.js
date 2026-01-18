export const deleteUser = async ({ usersRepository }, id) => {
  await usersRepository.remove(id);
  return true;
};
