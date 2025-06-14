import { isDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TodoDto{
    @IsOptional()
    id?: number;
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    priority:number;
    @IsOptional()
    dueDate?: Date;
    completed: boolean;
}