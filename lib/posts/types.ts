export type Post = {
    title: string;
    lowerTitle: string;
    year: number;
    month: number;
    pubtime: string;
    modtime?: string;
    tags: string[];
    lowerTags: string[];
    image?: string;
    description?: string;
    href: string;
    content: string;
    lowerContent: string;
};
