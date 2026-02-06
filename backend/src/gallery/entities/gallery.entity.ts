import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum GalleryCategory {
    CLASSROOM = 'Classroom',
    EVENTS = 'Events',
    CERTIFICATES = 'Certificates',
    OFFICE = 'Office',
    OTHER = 'Other',
}

@Entity('gallery_images')
export class GalleryImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'simple-enum', enum: GalleryCategory, default: GalleryCategory.OTHER, nullable: true })
    category: GalleryCategory;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    s3_key: string;

    @Column()
    public_url: string;

    @Column({ nullable: true })
    thumb_url: string;

    @Column({ default: false })
    is_featured: boolean;

    @CreateDateColumn()
    created_at: Date;
}
