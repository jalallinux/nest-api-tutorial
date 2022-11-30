import { IsEmail, IsString } from "class-validator";

export class UserUpdateDto {
    
    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsEmail()
    email: string;
}