import createUser from "../../domain/entities/user.js";
import bcrypt from "bcryptjs";

const createUserUseCase = async ({ userRepository }, input) => {
  const passwordHash = await bcrypt.hash(input.senha, 10);
  const savedUser = await userRepository.create({
    email: input.email,
    name: input.name,
    passwordHash
  });

  return createUser(savedUser);
};

export default createUserUseCase;
