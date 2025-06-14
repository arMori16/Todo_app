import { IsEmail, IsOptional, IsNotEmpty, IsString, IsNumber } from "class-validator"
export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    @IsString()
    password:string
}
export class AuthDtoWithName extends AuthDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;
}