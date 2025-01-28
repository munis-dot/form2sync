import { Router } from "express";
import authRoutes from './authRoutes.js'
import newsRouter from "./newsRoute.js";
import stockRoutes from "./stockRoutes.js";
import homeRoutes from "./homeRoutes.js";
const router = Router();

router.use('/auth', authRoutes)  
router.use('/news',newsRouter)
router.use('/stock', stockRoutes);
router.use('/', homeRoutes);
// router.get('',(req,res)=>{
//     res.json()
// })
export { router }