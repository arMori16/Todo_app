import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "src/common/guards";
import { AtStrategy } from "./strategy/at.strategy";
import { RtStrategy } from "./strategy/rt.strategy";

@Module({
    imports:[PrismaModule],
    controllers:[AuthController],
    providers:[AuthService,JwtService,ConfigService,{
      provide:APP_GUARD,
      useClass: AtGuard
    },AtStrategy,RtStrategy]
})
export class AuthModule{}