import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import {JwtPayload} from '../../auth/types/jwtPayload.type';

export const GetCurrentUserId = createParamDecorator(
    (_: undefined,context:ExecutionContext)=>{
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        if (user && typeof user.sub === 'number') {
            return user.sub;
        }
        return null;
    },
);