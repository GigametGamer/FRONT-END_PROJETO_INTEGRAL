import { Router } from "express";
import * as fornecedorController from "../controllers/fornecedorController.js";
import validarId from "../middlewares/validarId.js";
const router = Router();

router.get("/", fornecedorController.listar);

router.get("/:id", validarId, fornecedorController.buscarPorId);

router.post("/", fornecedorController.criar);

router.put("/:id", validarId, fornecedorController.atualizar);

router.delete("/:id", validarId, fornecedorController.excluir);

export default router;