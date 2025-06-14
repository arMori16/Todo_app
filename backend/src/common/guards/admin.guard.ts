import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminGuard extends AuthGuard('jwt'){
    constructor(private reflector:Reflector,private readonly prisma:PrismaService){
        super()
    }
    async canActivate(context:ExecutionContext):Promise<boolean>{
        const isPublic = this.reflector.getAllAndOverride('isPublic',[
            context.getHandler(),
            context.getClass()
        ]);

        if(isPublic) return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        return true;
    }
}