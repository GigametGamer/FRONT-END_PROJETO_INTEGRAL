import { Router } from "express";
import * as produtoController from "../controllers/produtoController.js";
import validarId from "../middlewares/validarId.js";
const router = Router();

router.get("/", produtoController.listar);

router.get("/:id", validarId, produtoController.buscarPorId);

router.post("/", produtoController.criar);

router.put("/:id", validarId, produtoController.atualizar);

router.delete("/:id", validarId, produtoController.excluir);

export default router;