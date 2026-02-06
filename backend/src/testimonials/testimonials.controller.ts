import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly service: TestimonialsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    create(@Body() dto: any) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    update(@Param('id') id: string, @Body() dto: any) {
        return this.service.update(+id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(+id);
    }
}
