import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('popups')
export class Popup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    image_url: string;

    @Column({ default: 'TRAINING' })
    type: string; // 'TRAINING' | 'HR' | 'HOME'

    @Column({ default: false })
    is_active: boolean;

    @Column({ nullable: true })
    s3_key: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
