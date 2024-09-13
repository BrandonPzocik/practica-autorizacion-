import { Router } from "express";
import {
  deleteTodosCtrl,
  getAllTodosCtrl,
  updateTodosCtrl,
} from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";

const todosRouter = Router();

todosRouter.get("/", validarJwt, getAllTodosCtrl);
todosRouter.delete("/:id", validarJwt, deleteTodosCtrl);
todosRouter.put("/:id", validarJwt, updateTodosCtrl);
export { todosRouter };
