import "reflect-metadata";
import {DataSource} from "typeorm";
import logger from "jet-logger";
import baseRouter from "./controllers";
import express, {Express} from "express"
import morgan from 'morgan';
import cors from "cors"
import cookieParser from "cookie-parser"
import {Task} from "./database/entities/Task";
import dotenv from "dotenv";


const app: Express = express();

dotenv.config({path: "./.env"});

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api', baseRouter);

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    ssl: process.env.NODE_ENV === 'production'
        ? {rejectUnauthorized: false} : false,
    entities: [Task]
})

AppDataSource.initialize()
    .then(() => {
        logger.info("Database is connected!")
        app.listen(process.env.PORT || 9000, () => {
            logger.info('Express server started on port: 9000');
        });
    })
    .catch((err) => {
        console.error(`Error during Data Source initialization ${err}`)
    })