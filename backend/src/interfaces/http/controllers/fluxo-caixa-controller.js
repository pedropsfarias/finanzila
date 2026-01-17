import createFluxoCaixaUseCase from "../../../application/usecases/create-fluxo-caixa.js";
import listFluxoCaixaUseCase from "../../../application/usecases/list-fluxo-caixa.js";
import fluxoCaixaRepository from "../../../infra/db/repositories/fluxo-caixa-repository.js";

const fluxoCaixaController = {
  create: async (req, res, next) => {
    try {
      const fluxo = await createFluxoCaixaUseCase(
        { fluxoCaixaRepository },
        {
          data: req.body.data,
          descricao: req.body.descricao,
          valor: req.body.valor,
          parcela: req.body.parcela ?? null,
          carteiraId: Number(req.body.carteiraId)
        }
      );

      res.status(201).json(fluxo);
    } catch (error) {
      next(error);
    }
  },
  list: async (_req, res, next) => {
    try {
      const fluxos = await listFluxoCaixaUseCase({ fluxoCaixaRepository });
      res.status(200).json(fluxos);
    } catch (error) {
      next(error);
    }
  }
};

export default fluxoCaixaController;
