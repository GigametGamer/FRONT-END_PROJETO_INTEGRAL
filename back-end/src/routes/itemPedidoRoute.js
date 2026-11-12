import { Router } from "express";
import * as itemPedidoController from "../controllers/itemPedidoController.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", itemPedidoController.listar);
router.get("/:id", validarId, itemPedidoController.buscarPorId);
router.post("/", itemPedidoController.criar);
router.put("/:id", validarId, itemPedidoController.atualizar);
router.delete("/:id", validarId, itemPedidoController.excluir);

export default router;