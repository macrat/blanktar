export type Post = {
    title: string;
    lowerTitle: string;
    year: number;
    month: number;
    pubtime: number;
    modtime?: number;
    tags: string[];
    lowerTags: string[];
    image?: string;
    description?: string;
    href: string;
    content: string;
    lowerContent: string;
};
