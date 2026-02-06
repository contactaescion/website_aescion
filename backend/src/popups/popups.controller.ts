import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PopupsService } from './popups.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('popups')
export class PopupsController {
    constructor(private readonly popupsService: PopupsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    @UseInterceptors(FileInterceptor('file'))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
    ) {
        return this.popupsService.create(file, title);
    }

    @Get()
    findAll() {
        return this.popupsService.findAll();
    }

    @Get('active')
    findActive() {
        return this.popupsService.findActive();
    }

    @Patch(':id/toggle')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    toggleActive(@Param('id') id: string) {
        return this.popupsService.toggleActive(+id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    remove(@Param('id') id: string) {
        return this.popupsService.remove(+id);
    }
}
