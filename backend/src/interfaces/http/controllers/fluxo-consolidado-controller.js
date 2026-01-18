import createFluxoConsolidadoUseCase from "../../../application/usecases/create-fluxo-consolidado.js";
import updateFluxoConsolidadoUseCase from "../../../application/usecases/update-fluxo-consolidado.js";
import listFluxoConsolidadoUseCase from "../../../application/usecases/list-fluxo-consolidado.js";
import deleteFluxoConsolidadoUseCase from "../../../application/usecases/delete-fluxo-consolidado.js";
import generateFluxoConsolidadoUseCase from "../../../application/usecases/generate-fluxo-consolidado.js";
import fluxoConsolidadoRepository from "../../../infra/db/repositories/fluxo-consolidado-repository.js";
import despesasRepository from "../../../infra/db/repositories/despesas-repository.js";
import carteirasRepository from "../../../infra/db/repositories/carteiras-repository.js";
import fluxoCaixaRepository from "../../../infra/db/repositories/fluxo-caixa-repository.js";

const fluxoConsolidadoController = {
  create: async (req, res, next) => {
    try {
      const fluxo = await createFluxoConsolidadoUseCase(
        { fluxoConsolidadoRepository },
        {
          mesReferencia: req.body.mesReferencia,
          data: req.body.data,
          descricao: req.body.descricao,
          valorEstimado: req.body.valorEstimado,
          dataPagamento: req.body.dataPagamento ?? null,
          valorPagamento: req.body.valorPagamento ?? null
        }
      );

      res.status(201).json(fluxo);
    } catch (error) {
      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const mesReferencia = req.query.mesReferencia;
      const fluxos = await listFluxoConsolidadoUseCase(
        { fluxoConsolidadoRepository },
        { mesReferencia }
      );
      res.status(200).json(fluxos);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const fluxo = await updateFluxoConsolidadoUseCase(
        { fluxoConsolidadoRepository },
        {
          id: Number(req.params.id),
          mesReferencia: req.body.mesReferencia,
          data: req.body.data,
          descricao: req.body.descricao,
          valorEstimado: req.body.valorEstimado,
          dataPagamento: req.body.dataPagamento ?? null,
          valorPagamento: req.body.valorPagamento ?? null
        }
      );

      if (!fluxo) {
        return res.status(404).json({ message: "fluxo consolidado not found" });
      }

      res.status(200).json(fluxo);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const removed = await deleteFluxoConsolidadoUseCase(
        { fluxoConsolidadoRepository },
        Number(req.params.id)
      );

      if (!removed) {
        return res.status(404).json({ message: "fluxo consolidado not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  generate: async (req, res, next) => {
    try {
      const result = await generateFluxoConsolidadoUseCase(
        { fluxoConsolidadoRepository, despesasRepository, carteirasRepository, fluxoCaixaRepository },
        { mesReferencia: req.body.mesReferencia }
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

export default fluxoConsolidadoController;
