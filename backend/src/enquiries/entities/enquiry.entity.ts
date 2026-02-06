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
    status: string;

    @CreateDateColumn()
    created_at: Date;
}
