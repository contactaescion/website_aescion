import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    role: string; // e.g. "Student at XYZ College"

    @Column({ type: 'int', nullable: true })
    rating: number;

    @Column('text')
    message: string;

    @Column({ default: false })
    is_featured: boolean;

    @CreateDateColumn()
    created_at: Date;
}
