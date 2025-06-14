import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TodoDto } from "./dto/todo.dto";

@Injectable()
export class TodoService {
    constructor(private prisma:PrismaService){}
    async getTodos(userId: number,page: number, limit: number) {
        try{
            const todos = await this.prisma.todo.findMany({
                skip: page * limit,
                take: limit,
                where:{
                    userId:userId
                },
                orderBy:{
                    createdAt: 'desc'
                }
            });
            return todos;
        }catch (error) {
            console.error("Error fetching todos:", error);
            throw new Error("Could not fetch todos");
        }
    }
    async createTodo(dto:TodoDto,userId:number){
        try{
            console.log(`DTO: `, dto);
            
            if (dto.id) {
                return await this.prisma.todo.update({
                  where: { userId:userId,id: dto.id }, 
                  data: {
                    title: dto.title,
                    priority: dto.priority,
                    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                    completed: dto.completed,
                    updatedAt: new Date(),
                  },
                })}else{
                    return await this.prisma.todo.create({
                        data: {
                          title: dto.title,
                          priority: dto.priority,
                          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                          completed: dto.completed,
                          userId:userId,
                        },
                      });
                };
        }catch(err){
            console.error("Error creating todo:", err);
            throw new Error("Could not create todo");
        }
    }
    async deleteTodo(userId:number,id:number){
        try{
            const deleteTodo = await this.prisma.todo.delete({
                where:{
                    userId:userId,
                    id:id
                }
            })
        }catch(err){
            throw new BadRequestException(`Couldn't delete this record!`)
        }
    }
}