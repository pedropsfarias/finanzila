const deleteUserUseCase = async ({ userRepository }, id) => {
  const removed = await userRepository.remove(id);
  return Boolean(removed);
};

export default deleteUserUseCase;
