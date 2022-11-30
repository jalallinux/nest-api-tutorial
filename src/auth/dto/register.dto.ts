import { IsString, IsEmail, IsNotEmpty, Min } from "class-validator";


export class AuthRegisterDto {

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Min(6)
    password: string;
}
