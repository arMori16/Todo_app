import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { AtGuard } from "src/common/guards";
import { TodoDto } from "./dto/todo.dto";
import { GetCurrentUserId } from "src/common/decorators";


@Controller('todo')
export class TodoController {
    constructor(private service:TodoService){}
    @UseGuards(AtGuard)
    @Post('create')
    async createTodo(@Body() dto:TodoDto,@GetCurrentUserId() userId: number) {
        try{
            return await this.service.createTodo(dto,userId);
        }catch(err){
            throw new Error("Could not create todo");
        }
    }
    @Delete('delete')
    async deleteTodo(@GetCurrentUserId() userId:number,@Query('id') id:number){
        return await this.service.deleteTodo(userId,id)
    }
    @Get()
    async getTodos(@GetCurrentUserId() userId: number,@Query('page') page, @Query('limit') limit:number = 15) {
        try{
            return await this.service.getTodos(userId, page, limit);
        }catch(err){
            throw new Error("Could not fetch todos");
        }
    }
}