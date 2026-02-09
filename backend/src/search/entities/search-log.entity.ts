import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class SearchLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    query: string;

    @Column('simple-json', { nullable: true })
    results_count: { courses: number; gallery: number };

    @Column({ nullable: true })
    ip_address: string;

    @CreateDateColumn()
    created_at: Date;
}
