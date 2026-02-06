import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Patch, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { GalleryCategory } from './entities/gallery.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('gallery')
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) { }

    @Post('upload')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    @UseInterceptors(FileInterceptor('file'))
    upload(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('category') category: GalleryCategory,
    ) {
        return this.galleryService.uploadFile(file, title, description, category);
    }

    @Get()
    findAll() {
        return this.galleryService.findAll();
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    remove(@Param('id') id: string) {
        return this.galleryService.remove(+id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.STAFF)
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.galleryService.update(+id, updateDto);
    }
}
