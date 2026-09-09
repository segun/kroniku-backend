import { EventsService } from '../events/events.service';
import { SyncEvent } from '../events/entities/sync-event.entity';
import { UsersService } from '../users/users.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { KeywordSearchDto } from './dto/keyword-search.dto';
import { NaturalSearchDto } from './dto/natural-search.dto';
export interface RankedSearchResult {
    event: SyncEvent;
    score: number;
}
export declare function tokenizeNaturalQuery(query: string): string[];
export declare function expandNaturalTerms(terms: string[]): string[];
export declare function rerankNaturalResults(results: RankedSearchResult[], query: string, terms: string[], referenceDate?: Date): RankedSearchResult[];
export declare class SearchService {
    private readonly eventsService;
    private readonly usersService;
    constructor(eventsService: EventsService, usersService: UsersService);
    keyword(user: RequestUser, dto: KeywordSearchDto): Promise<{
        mode: string;
        query: string;
        count: number;
        results: SyncEvent[];
    }>;
    natural(user: RequestUser, dto: NaturalSearchDto): Promise<{
        mode: string;
        query: string;
        rationale: string;
        count: number;
        results: RankedSearchResult[];
    }>;
}
