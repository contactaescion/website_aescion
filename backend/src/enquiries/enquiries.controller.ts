import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
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
}
