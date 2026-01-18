import createCarteiraUseCase from "../../../application/usecases/create-carteira.js";
import listCarteirasUseCase from "../../../application/usecases/list-carteiras.js";
import carteirasRepository from "../../../infra/db/repositories/carteiras-repository.js";

const normalizeAliases = (aliases) => {
  if (!aliases) {
    return [];
  }

  if (Array.isArray(aliases)) {
    return aliases.map((alias) => String(alias).trim()).filter(Boolean);
  }

  return String(aliases)
    .split(",")
    .map((alias) => alias.trim())
    .filter(Boolean);
};

const carteirasController = {
  create: async (req, res, next) => {
    try {
      const carteira = await createCarteiraUseCase(
        { carteirasRepository },
        {
          nome: req.body.nome,
          aliases: normalizeAliases(req.body.aliases),
          diaFechamento: Number(req.body.diaFechamento),
          diaPagamento: Number(req.body.diaPagamento)
        }
      );

      res.status(201).json(carteira);
    } catch (error) {
      next(error);
    }
  },
  list: async (_req, res, next) => {
    try {
      const carteiras = await listCarteirasUseCase({ carteirasRepository });
      res.status(200).json(carteiras);
    } catch (error) {
      next(error);
    }
  }
};

export default carteirasController;
