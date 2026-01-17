import createUser from "../../domain/entities/user.js";
import bcrypt from "bcryptjs";

const updateUserUseCase = async ({ userRepository }, input) => {
  const passwordHash = input.senha ? await bcrypt.hash(input.senha, 10) : null;

  const updatedUser = await userRepository.update({
    id: input.id,
    email: input.email,
    name: input.name,
    passwordHash
  });

  return updatedUser ? createUser(updatedUser) : null;
};

export default updateUserUseCase;
