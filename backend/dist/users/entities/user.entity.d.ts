export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    STAFF = "STAFF",
    TRAINER = "TRAINER",
    HR = "HR",
    STUDENT = "STUDENT"
}
export declare class User {
    id: number;
    email: string;
    password?: string;
    name: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
}
