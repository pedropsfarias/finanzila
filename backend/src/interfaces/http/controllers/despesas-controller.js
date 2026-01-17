import createDespesaUseCase from "../../../application/usecases/create-despesa.js";
import listDespesasUseCase from "../../../application/usecases/list-despesas.js";
import despesasRepository from "../../../infra/db/repositories/despesas-repository.js";

const despesasController = {
  create: async (req, res, next) => {
    try {
      const despesa = await createDespesaUseCase(
        { despesasRepository },
        {
          dia: Number(req.body.dia),
          descricao: req.body.descricao,
          valorEstimado: req.body.valorEstimado
        }
      );

      res.status(201).json(despesa);
    } catch (error) {
      next(error);
    }
  },
  list: async (_req, res, next) => {
    try {
      const despesas = await listDespesasUseCase({ despesasRepository });
      res.status(200).json(despesas);
    } catch (error) {
      next(error);
    }
  }
};

export default despesasController;
