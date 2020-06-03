import { Router } from 'express'
import ItemsRouter from './ItemsRouter'
import PointsRouter from './PointsRouter'

const router = Router()

router.use('/items', ItemsRouter)
router.use('/points', PointsRouter)

export default router