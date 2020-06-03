import { Request, Response } from "express";
import knex from "../databases/connection";

class UsersController {
    async index(req: Request, res: Response) {
        const items = await knex('items').select("*")
        
        // Serialized Items
        const serializedItems = items.map(({ image, ...other }) => 
            ({ ...other, image_url:`http://localhost:3030/uploads/${image}` }))

        res.json(serializedItems)
    }
}

export default new UsersController()
