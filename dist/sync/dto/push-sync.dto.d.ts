export declare class PushSyncEventDto {
    eventId: string;
    version: number;
    occurredAt?: string;
    source?: string;
    title?: string;
    detail?: string;
    searchText?: string;
    encryptedPayload: string;
    payloadHash: string;
    isDeleted?: boolean;
}
export declare class PushSyncDto {
    events: PushSyncEventDto[];
}
