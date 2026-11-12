import { Router } from "express";
import * as enderecoController from "../controllers/enderecoController.js";
import validarId from "../middlewares/validarId.js";
const router = Router();

router.get("/", enderecoController.listar);

router.get("/:id", validarId, enderecoController.buscarPorId);

router.post("/", enderecoController.criar);

router.put("/:id", validarId, enderecoController.atualizar);

router.delete("/:id", validarId, enderecoController.excluir);

export default router;