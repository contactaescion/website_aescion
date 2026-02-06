export declare enum GalleryCategory {
    CLASSROOM = "Classroom",
    EVENTS = "Events",
    CERTIFICATES = "Certificates",
    OFFICE = "Office",
    OTHER = "Other"
}
export declare class GalleryImage {
    id: number;
    title: string;
    category: GalleryCategory;
    description: string;
    s3_key: string;
    public_url: string;
    thumb_url: string;
    is_featured: boolean;
    created_at: Date;
}
