import { Module } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "src/common/guards";
import { AtStrategy } from "src/auth/strategy/at.strategy";


@Module({
    controllers: [TodoController],
    providers: [TodoService,PrismaService,{
        provide:APP_GUARD,
        useClass: AtGuard
    }],
    
})
export class TodoModule {}