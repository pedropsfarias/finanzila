import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../../config/env.js";
import userRepository from "../../../infra/db/repositories/user-repository.js";

const parseBasicAuth = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return null;
  }

  const encoded = authHeader.slice("Basic ".length).trim();
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const [email, senha] = decoded.split(":");

  if (!email || !senha) {
    return null;
  }

  return { email, senha };
};

const authController = {
  login: async (req, res, next) => {
    try {
      const credentials = parseBasicAuth(req.headers.authorization);

      if (!credentials) {
        return res.status(401).json({ message: "invalid basic auth" });
      }

      const user = await userRepository.findByEmail(credentials.email);

      if (!user) {
        return res.status(401).json({ message: "invalid credentials" });
      }

      const matches = await bcrypt.compare(credentials.senha, user.passwordHash);

      if (!matches) {
        return res.status(401).json({ message: "invalid credentials" });
      }

      const token = jwt.sign(
        { sub: user.id, email: user.email, name: user.name },
        env.jwtSecret,
        { expiresIn: "1d" }
      );

      return res.status(200).json({ token });
    } catch (error) {
      return next(error);
    }
  }
};

export default authController;
