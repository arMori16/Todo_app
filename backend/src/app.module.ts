import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [PrismaModule,AuthModule,TodoModule],
  controllers: [AppController],
  providers: [AppService,JwtService],
})
export class AppModule {}
