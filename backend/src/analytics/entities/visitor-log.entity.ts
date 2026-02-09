import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class VisitorLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    ip_hash: string;

    @Column({ nullable: true })
    user_agent: string;

    @Column()
    path: string;

    @Column({ nullable: true })
    referrer: string;

    @Column({ nullable: true })
    method: string;

    @CreateDateColumn()
    visited_at: Date;
}
