import { Router } from "express";
import * as pagamentoController from "../controllers/pagamentoController.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", pagamentoController.listar);
router.get("/:id", validarId, pagamentoController.buscarPorId);
router.post("/", pagamentoController.criar);
router.put("/:id", validarId, pagamentoController.atualizar);
router.delete("/:id", validarId, pagamentoController.excluir);

export default router;