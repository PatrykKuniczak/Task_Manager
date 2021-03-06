import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {IsBoolean, Length, Max, Min, MinLength} from "class-validator";
import {createTimeStamp} from "../../controllers/helpers/helpers";


@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(5, 255, {
        message: "Title must have minimum length $constraint1 and maximal length is $constraint2."
    })
    title: string;

    @Column("text")
    @MinLength(10, {
        message: "Description is too short. Minimal length is $constraint1."
    })
    description: string;

    @IsBoolean({message: "Important must be a boolean value."})
    @Column()
    important: boolean;

    @Column("bigint")
    @Min(Date.parse(new Date().toUTCString()) / 1000, {message: "Date must be after actual date."})
    @Max(createTimeStamp("2100-01-01 00:00"), {message: "Date must be before 2100-01-01 00:00."})
    date: number
}