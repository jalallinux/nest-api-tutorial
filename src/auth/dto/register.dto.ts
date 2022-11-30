import { IsString, IsEmail, IsNotEmpty } from "class-validator";


export class RegisterDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
