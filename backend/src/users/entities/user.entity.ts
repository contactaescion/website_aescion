import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    STAFF = 'STAFF',
    TRAINER = 'TRAINER',
    HR = 'HR',
    STUDENT = 'STUDENT',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string; // Hashed

    @Column({ unique: true })
    name: string;

    @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.STAFF })
    role: UserRole;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ nullable: true })
    resetPasswordExpires: Date;
}
