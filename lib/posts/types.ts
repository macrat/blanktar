export type Post = {
    title: string;
    lowerTitle: string;
    year: number;
    month: number;
    file: string;
    pubtime: number;
    modtime?: number;
    tags: string[];
    lowerTags: string[];
    image?: string | string[];
    description?: string;
    href: string;
    content: string;
    lowerContent: string;
};
