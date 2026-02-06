import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    create(@Body() createCourseDto: Partial<Course>) {
        return this.coursesService.create(createCourseDto);
    }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    update(@Param('id') id: string, @Body() updateCourseDto: Partial<Course>) {
        return this.coursesService.update(+id, updateCourseDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    remove(@Param('id') id: string) {
        return this.coursesService.remove(+id);
    }
}
