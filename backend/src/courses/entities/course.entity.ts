import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    duration: string;

    @Column()
    fees: string;

    @Column()
    timing: string;

    @Column()
    mode: string;

    @Column({ default: true })
    placement_support: boolean;

    @Column({ nullable: true })
    trainer_name: string;

    @Column({ nullable: true })
    trainer_experience: string;

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
}
