import { SearchService } from './search.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { KeywordSearchDto } from './dto/keyword-search.dto';
import { NaturalSearchDto } from './dto/natural-search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    keyword(user: RequestUser, dto: KeywordSearchDto): Promise<{
        mode: string;
        query: string;
        count: number;
        results: import("../events/entities/sync-event.entity").SyncEvent[];
    }>;
    natural(user: RequestUser, dto: NaturalSearchDto): Promise<{
        mode: string;
        query: string;
        rationale: string;
        count: number;
        results: import("./search.service").RankedSearchResult[];
    }>;
}
