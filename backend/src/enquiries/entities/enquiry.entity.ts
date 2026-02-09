import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('enquiries')
export class Enquiry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    phone: string;

    // Made required in validation, but nullable in DB to prevent migration crash on existing data
    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    course_interest: string;

    @Column('text', { nullable: true })
    message: string;

    @Column({ default: 'NEW' })
    status: string; // NEW, CONTACTED, FOLLOW_UP, CONVERTED, CLOSED

    @Column({ default: 'TRAINING' })
    type: string; // TRAINING, HR

    @Column({ nullable: true })
    source: string; // search, course_page, etc.

    @Column({ nullable: true })
    assigned_to: number; // User ID of staff

    @Column('simple-json', { nullable: true })
    notes: string[]; // Internal notes

    @Column({ nullable: true })
    session_id: string;

    @CreateDateColumn()
    created_at: Date;
}
