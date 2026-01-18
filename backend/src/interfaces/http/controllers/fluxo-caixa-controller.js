import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import createFluxoCaixaUseCase from "../../../application/usecases/create-fluxo-caixa.js";
import updateFluxoCaixaUseCase from "../../../application/usecases/update-fluxo-caixa.js";
import listFluxoCaixaUseCase from "../../../application/usecases/list-fluxo-caixa.js";
import deleteFluxoCaixaUseCase from "../../../application/usecases/delete-fluxo-caixa.js";
import importFluxoCaixaUseCase from "../../../application/usecases/import-fluxo-caixa.js";
import { parseFluxoCaixaFile } from "../../../infra/importers/fluxo-caixa-importer.js";
import fluxoCaixaRepository from "../../../infra/db/repositories/fluxo-caixa-repository.js";
import carteirasRepository from "../../../infra/db/repositories/carteiras-repository.js";

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
  },
  update: async (req, res, next) => {
    try {
      const fluxo = await updateFluxoCaixaUseCase(
        { fluxoCaixaRepository },
        {
          id: Number(req.params.id),
          data: req.body.data,
          descricao: req.body.descricao,
          valor: req.body.valor,
          parcela: req.body.parcela ?? null,
          carteiraId: Number(req.body.carteiraId)
        }
      );

      if (!fluxo) {
        return res.status(404).json({ message: "fluxo not found" });
      }

      res.status(200).json(fluxo);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const removed = await deleteFluxoCaixaUseCase({ fluxoCaixaRepository }, Number(req.params.id));

      if (!removed) {
        return res.status(404).json({ message: "fluxo not found" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  importXlsx: async (req, res, next) => {
    let tempPath = null;
    try {
      const { contentBase64, fileName, carteiraId } = req.body ?? {};
      if (!contentBase64) {
        res.status(400).json({ message: "Arquivo nao informado." });
        return;
      }
      const rawBase64 = String(contentBase64).includes(",")
        ? String(contentBase64).split(",")[1]
        : String(contentBase64);
      const buffer = Buffer.from(rawBase64, "base64");
      tempPath = path.join(os.tmpdir(), `${randomUUID()}-${fileName || "fluxo-caixa.xlsx"}`);
      await fs.writeFile(tempPath, buffer);
      const { strategy, registros } = parseFluxoCaixaFile({ filePath: tempPath, fileName });
      if (!strategy) {
        res.status(400).json({ message: "Formato de arquivo nao suportado." });
        return;
      }
      if (strategy.requiresCarteira && !carteiraId) {
        res.status(400).json({ message: "Carteira obrigatoria para este formato." });
        return;
      }
      const resultado = await importFluxoCaixaUseCase(
        { fluxoCaixaRepository, carteirasRepository },
        { registros, carteiraId: carteiraId ? Number(carteiraId) : null }
      );
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    } finally {
      if (tempPath) {
        try {
          await fs.unlink(tempPath);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
};

export default fluxoCaixaController;
