import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsJSON } from 'class-validator';
import { CourseType, CourseStatus } from '../entities/course.entity';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsEnum(CourseType)
    type?: CourseType;

    @IsOptional()
    @IsEnum(CourseStatus)
    status?: CourseStatus;

    @IsOptional()
    @IsString()
    duration?: string;

    @IsOptional()
    @IsString()
    fees?: string;

    @IsOptional()
    @IsString()
    mode?: string;

    @IsOptional()
    @IsBoolean()
    placement_support?: boolean;

    @IsOptional()
    @IsString()
    trainer_name?: string;

    @IsOptional()
    // @IsJSON() // disabled as input might be object not string json
    modules?: any;

    @IsOptional()
    @IsBoolean()
    is_featured?: boolean;

    @IsOptional()
    @IsString()
    code_snippet?: string;
}
