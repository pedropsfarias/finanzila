import createUserUseCase from "../../../application/usecases/create-user.js";
import listUsersUseCase from "../../../application/usecases/list-users.js";
import getUserUseCase from "../../../application/usecases/get-user.js";
import updateUserUseCase from "../../../application/usecases/update-user.js";
import deleteUserUseCase from "../../../application/usecases/delete-user.js";
import userRepository from "../../../infra/db/repositories/user-repository.js";

const usersController = {
  create: async (req, res, next) => {
    try {
      const user = await createUserUseCase(
        { userRepository },
        {
          email: req.body.email,
          name: req.body.name,
          senha: req.body.senha
        }
      );

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
  list: async (_req, res, next) => {
    try {
      const users = await listUsersUseCase({ userRepository });
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      const user = await getUserUseCase({ userRepository }, Number(req.params.id));

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const user = await updateUserUseCase(
        { userRepository },
        {
          id: Number(req.params.id),
          email: req.body.email,
          name: req.body.name,
          senha: req.body.senha
        }
      );

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const removed = await deleteUserUseCase({ userRepository }, Number(req.params.id));

      if (!removed) {
        return res.status(404).json({ message: "user not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

export default usersController;
