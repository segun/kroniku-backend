export declare class User {
    id: string;
    email: string;
    retrievalOptIn: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    normalizeEmail(): void;
}
