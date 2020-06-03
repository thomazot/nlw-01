import {Router} from 'express'
import ItemsController from '../controllers/ItemsController'

const router = Router()

router.get('/', ItemsController.index)

export default router

