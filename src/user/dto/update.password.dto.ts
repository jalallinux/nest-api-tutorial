import { Equals, IsEmail, IsNotEmpty, IsString, Min } from "class-validator";

export class UserUpdatePasswordDto {
    
    @IsNotEmpty()
    @IsString()
    // @Min(6)
    current_password: string;

    @IsNotEmpty()
    @IsString()
    // @Min(6)
    password: string;
}