import { Router } from "express";
import { getAgriNews } from "../controller/newsController.js";

const newsRouter = Router();

newsRouter.get('/agri',getAgriNews)

export default newsRouter;