import createDespesaUseCase from "../../../application/usecases/create-despesa.js";
import updateDespesaUseCase from "../../../application/usecases/update-despesa.js";
import listDespesasUseCase from "../../../application/usecases/list-despesas.js";
import deleteDespesaUseCase from "../../../application/usecases/delete-despesa.js";
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
  },
  update: async (req, res, next) => {
    try {
      const despesa = await updateDespesaUseCase(
        { despesasRepository },
        {
          id: Number(req.params.id),
          dia: Number(req.body.dia),
          descricao: req.body.descricao,
          valorEstimado: req.body.valorEstimado
        }
      );

      if (!despesa) {
        return res.status(404).json({ message: "despesa not found" });
      }

      res.status(200).json(despesa);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const removed = await deleteDespesaUseCase({ despesasRepository }, Number(req.params.id));

      if (!removed) {
        return res.status(404).json({ message: "despesa not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

export default despesasController;
