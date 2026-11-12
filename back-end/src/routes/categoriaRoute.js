import { Router } from "express";
import * as categoriaController from "../controllers/categoriaController.js";
import validarId from "../middlewares/validarId.js";
const router = Router();

router.get("/", categoriaController.listar);

router.get("/:id", validarId, categoriaController.buscarPorId);

router.post("/", categoriaController.criar);

router.put("/:id", validarId, categoriaController.atualizar);

router.delete("/:id", validarId, categoriaController.excluir);

export default router;