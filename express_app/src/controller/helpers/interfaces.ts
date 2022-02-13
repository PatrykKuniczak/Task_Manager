import {Request, Response} from "express";
import {Notification} from "../../database/entity/Notification";
import {Type} from "../../database/entity/Type";
import {Task} from "../../database/entity/Task";
import {EntityTarget} from "typeorm";

export type IRepository = Notification | Type | Task
export type IEntityRepository = EntityTarget<IRepository>;
export type IJsonMessage = { error: string[] };

declare global {
    interface String {
        toTitle(): string
        fullTrim(): string
    }
}

export interface IItems {
    (Repository: IEntityRepository): {
        create(req: Request, res: Response): Promise<Response>
        edit(req: Request, res: Response): Promise<Response>
        delete(req: Request, res: Response): Promise<Response>
        displayAll(req: Request, res: Response): Promise<Response>
        displayOne(req: Request, res: Response): Promise<Response>
        displayById(req: Request, res: Response): Promise<Response>
    }
}