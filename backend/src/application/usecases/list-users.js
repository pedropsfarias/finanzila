import createUser from "../../domain/entities/user.js";

const listUsersUseCase = async ({ userRepository }) => {
  const users = await userRepository.list();
  return users.map((user) => createUser(user));
};

export default listUsersUseCase;
