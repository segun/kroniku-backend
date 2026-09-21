export declare class SyncPlaceDto {
    name: string;
    latitude?: number;
    longitude?: number;
}
export declare class SyncWeatherDto {
    observedAt: string;
    condition?: string;
    temperatureC?: number;
}
export declare class SyncPhotoReferenceDto {
    assetIdentifier: string;
    filename?: string;
    addedAt: string;
}
export declare class SyncEventContextDto {
    place?: SyncPlaceDto;
    weather?: SyncWeatherDto;
    motion?: string;
    timeSemantics?: string[];
    photoReferences?: SyncPhotoReferenceDto[];
}
export declare class PushSyncEventDto {
    eventId: string;
    version: number;
    occurredAt?: string;
    source?: string;
    title?: string;
    detail?: string;
    searchText?: string;
    contextData?: SyncEventContextDto;
    encryptedPayload: string;
    payloadHash: string;
    isDeleted?: boolean;
}
export declare class PushSyncDto {
    events: PushSyncEventDto[];
}
