import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import validarId from "../middlewares/validarId.js";
const router = Router();

router.get("/", usuarioController.listar);

router.get("/:id", validarId, usuarioController.buscarPorId);

router.post("/", usuarioController.criar);

router.put("/:id", validarId, usuarioController.atualizar);

router.delete("/:id", validarId, usuarioController.excluir);

export default router;