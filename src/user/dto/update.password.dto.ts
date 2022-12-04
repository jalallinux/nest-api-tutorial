import { Equals, IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class UserUpdatePasswordDto {
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    current_password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}