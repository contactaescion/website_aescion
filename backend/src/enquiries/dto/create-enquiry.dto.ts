import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEnquiryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    course_interest?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    message: string;
}
