import { Request, Response } from "express"
import knex from "../databases/connection"

class PointsController {
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query
        const parsedItems = String(items)
            .split(",")
            .map((item) => Number(item.trim()))

        const points = await knex("points")
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", parsedItems)
            .where("city", String(city))
            .where("uf", String(uf))
            .distinct()
            .select("points.*")

        res.json(points)
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const point = await knex("points").where("id", id).first()

        if (!point) {
            return res.status(400).json({ message: "Point not found!" })
        }

        const items = await knex("items")
            .select("items.title")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", id)

        res.json({
            ...point,
            items,
        })
    }

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items,
        } = req.body

        const trx = await knex.transaction()
        const point = {
            image: "image-fake",
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }

        try {
            const insertedIds = await trx("points").insert(point)
            const point_id = insertedIds[0]
            const pointItems = items.map((item_id: number) => ({
                item_id,
                point_id,
            }))

            await trx("point_items").insert(pointItems)

            await trx.commit()

            res.json({
                id: point_id,
                ...point,
                items,
            })
        } catch (err) {
            await trx.rollback()
            res.json({
                message: err.message
            })
        }
    }
}

export default new PointsController()
