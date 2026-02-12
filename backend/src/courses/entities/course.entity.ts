import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

export enum CourseType { COURSE = 'course', INTERNSHIP = 'internship', WORKSHOP = 'workshop', WEBINAR = 'webinar' }
export enum CourseStatus { DRAFT = 'draft', PUBLISHED = 'published', ARCHIVED = 'archived' }

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    slug: string | null;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'enum', enum: CourseType, default: CourseType.COURSE })
    type: CourseType;

    @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.DRAFT })
    status: CourseStatus;

    @Column({ nullable: true })
    duration: string;

    @Column({ nullable: true })
    fees: string;

    @Column({ nullable: true })
    mode: string;

    @Column({ default: false })
    placement_support: boolean;

    @Column({ nullable: true })
    trainer_name: string;

    @Column('simple-json', { nullable: true })
    modules: any;

    @Column({ default: false })
    is_featured: boolean;

    @Column({ type: 'text', nullable: true })
    code_snippet: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if ((!this.slug || this.slug === '') && this.title) {
            const s = this.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            this.slug = `${s}-${Date.now().toString().slice(-4)}`;
        }
    }
}
