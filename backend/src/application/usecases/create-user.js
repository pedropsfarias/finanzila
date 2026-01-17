import createUser from "../../domain/entities/user.js";

const createUserUseCase = async ({ userRepository }, input) => {
  const savedUser = await userRepository.create({
    email: input.email,
    name: input.name
  });

  return createUser(savedUser);
};

export default createUserUseCase;
