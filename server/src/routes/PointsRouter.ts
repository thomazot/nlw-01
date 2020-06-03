import {Router} from 'express'
import PointsController from '../controllers/PointsController'

const router = Router()

router.get('/', PointsController.index)
router.get('/:id([0-9]+)', PointsController.show)
router.post('/', PointsController.create)

export default router

