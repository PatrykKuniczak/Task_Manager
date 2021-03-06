import {IEntityRepository, IJsonMessage, IRepository} from "../controllers/helpers/interfaces";
import {validateOrReject} from "class-validator";
import {Task} from "../database/entities/Task";
import {Request, Response} from "express";
import {AppDataSource} from "../index";
import {createTimeStamp, fullTrim} from "../controllers/helpers/helpers";


export const createItem = async (req: Request, res: Response, Repository: IEntityRepository) => {
    const [title, description, important, date] = validBody(req);

    if (date === "Invalid Date")
        return new Error("Date is invalid");

    const reqTimeStamp = createTimeStamp(date);

    switch (Repository) {
        case Task:
            const task = new Task();
            task.title = title;
            task.description = description;
            task.important = important;
            task.date = reqTimeStamp;

            return await validItem(req, res, Repository, task);
    }
}

export const validItem = async (req, res, Repository, entityObject): Promise<IJsonMessage | IRepository> => {
    try {
        await validateOrReject(entityObject);
        return AppDataSource.manager.create(Repository, entityObject);

    } catch (err) {
        return createValidationErrors(res, err);
    }
}

export const validBody = (req) => {
    const title = req.body.title && fullTrim(req.body.title);
    const description = req.body.description && fullTrim(req.body.description);
    const important = (req.body.important === true || req.body.important === false) && req.body.important;
    const date = req.body.date;

    return [title, description, important, date];
}

export const createValidationErrors = (res, err): IJsonMessage => {
    const errorMappedArray = err.map((value) => {
        return Object.values(value.constraints);
    });

    if (errorMappedArray.length > 1) {
        const errorsArray = errorMappedArray.reduce((acc, currValue) => {
            return acc + "@##@" + currValue
        }).split("@##@");

        return {error: errorsArray};
    }

    return {error: errorMappedArray[0]};
}