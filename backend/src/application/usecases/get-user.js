import createUser from "../../domain/entities/user.js";

const getUserUseCase = async ({ userRepository }, id) => {
  const user = await userRepository.findById(id);
  return user ? createUser(user) : null;
};

export default getUserUseCase;
