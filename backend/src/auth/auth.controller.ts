import { BadRequestException, Body, Controller, ForbiddenException, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "src/common/decorators/public.decorator";
import { AuthDto, AuthDtoWithName } from "./dto/auth.dto";
import { AtGuard, RtGuard } from "src/common/guards";
import { GetCurrentUserId, GetCurrentUser } from "src/common/decorators";
import { Tokens } from "./types";


@Controller('/')
export class AuthController{
    constructor(private service:AuthService){
        
    }
    @Public()
    @Post('/signup')
    async handleSignUp(@Body() dto:AuthDtoWithName){
        try {
            console.log('ASHAHSAHA');
            
            this.service.signup(dto);
        } catch (error) {
            throw new HttpException(
                {
                    message: error.message,
                    error: error.name,
                },
                HttpStatus.FORBIDDEN
            );
        }
    }
    @UseGuards(AtGuard)
    @Post('logout')
    async logout(@GetCurrentUserId() userId:number):Promise<boolean>{
        if (!userId) {
            throw new BadRequestException('User ID not found');
        }
        return this.service.logout(userId);
    }
    @Public()
    @Post('/signin')
    async handleSignIn(@Body() dto:AuthDto){
        try {
            return await this.service.signin(dto);
        } catch (error) {
            console.error('Error in handleSignIn:', error);  // Логируем ошибку
            throw new BadRequestException(error);
        }
    }
    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    async refreshTokens(@GetCurrentUserId() userId:number,
                        @GetCurrentUser('refreshToken') refreshToken:string):Promise<Tokens>{
                            if(!userId){throw new BadRequestException('User ID not found');}
                            return this.service.refreshTokens(userId,refreshToken);

    } 
}