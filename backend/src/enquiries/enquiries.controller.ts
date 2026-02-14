import { Controller, Get, Post, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('enquiries')
export class EnquiriesController {
    constructor(private readonly service: EnquiriesService) { }

    @Post()
    create(@Body() dto: any) {
        return this.service.create(dto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    findAll() {
        return this.service.findAll();
    }

    @Post(':id/status')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    updateStatus(@Body() body: { status: string }, @Param('id') id: number) {
        return this.service.updateStatus(id, body.status);
    }

    @Post(':id/assign')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    assign(@Body() body: { assigned_to: number }, @Param('id') id: number) {
        return this.service.assign(id, body.assigned_to);
    }

    @Post(':id/notes')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    addNote(@Body() body: { note: string }, @Param('id') id: number) {
        return this.service.addNote(id, body.note);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    remove(@Param('id') id: number) {
        return this.service.remove(id);
    }
}
