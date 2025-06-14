import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, AuthDtoWithName } from "./dto/auth.dto";
import * as argon from 'argon2'
import { JwtPayload } from "./types/jwtPayload.type";
import { Tokens } from "./types";
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";

@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
    async signup(dto:AuthDtoWithName){
        const oldUser = await this.prisma.user.findUnique({
            where:{
                email:dto.email,
            }
        })
        if(oldUser) throw new BadRequestException('This user is already exist')
        //hash the password
        const hash = await argon.hash(dto.password);
        try{
            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash:hash,
                    firstName:dto.firstName,
                },
                select:{
                    id:true,
                    email:true,
                    firstName:true,
                    createdAt:true
                }
            })
            const tokens:Tokens = await this.signToken(user.id,user.email);
            return {user,tokens};
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentials taken!')
                }
            }
            throw error;

        }
    }
    async signin(dto:AuthDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email:dto.email
            }
        })
        if(!user){
            throw new ForbiddenException('Credential incorrect')
        }
        const pwMatches = await argon.verify(user.hash,dto.password);
        if(!pwMatches){
            throw new ForbiddenException('Credentials incorrect')
        }
        const tokens:Tokens = await this.signToken(user.id,user.email);
        
        return {user,tokens};
    }
    async logout(userId:number):Promise<boolean>{
        await this.prisma.user.updateMany({
            where:{
                id:userId,
            },
            data:{
                hashedRT:null
            }
        })
        return true;
    }
    private async signToken(userId:number,email:string):Promise<Tokens>{

        const payload:JwtPayload = {
            sub:userId,
            email:email
        }
        const accessSecret = process.env.JWT_SECRET
        const refreshSecret = process.env.JWT_REFRESH_TOKEN
        const [accessToken,refreshToken] = await Promise.all([
            this.jwt.signAsync(payload,{
                expiresIn:'1h',
                secret:accessSecret
            }),
            this.jwt.signAsync(payload,{
                expiresIn: '28d',
                secret:refreshSecret
            })
            
        ])
        return {access_token:accessToken,
            refresh_token:refreshToken};
    }
    async refreshTokens(userId:number,refreshToken:string):Promise<Tokens>{
        const user = await this.prisma.user.findUnique({
            where:{
                id:userId,
            },
            select:{
                id:true,
                email:true,
                hashedRT:true
            }
        })
        if(!user || !refreshToken) throw new ForbiddenException('Access denied');
        const tokens:Tokens = await this.signToken(user.id,user.email);
        return tokens;
    }
}