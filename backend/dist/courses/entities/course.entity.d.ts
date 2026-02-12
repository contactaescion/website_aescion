export declare enum CourseType {
    COURSE = "course",
    INTERNSHIP = "internship",
    WORKSHOP = "workshop",
    WEBINAR = "webinar"
}
export declare enum CourseStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class Course {
    id: number;
    title: string;
    slug: string | null;
    imageUrl: string;
    type: CourseType;
    status: CourseStatus;
    duration: string;
    fees: string;
    mode: string;
    placement_support: boolean;
    trainer_name: string;
    modules: any;
    is_featured: boolean;
    code_snippet: string;
    created_at: Date;
    updated_at: Date;
    generateSlug(): void;
}
