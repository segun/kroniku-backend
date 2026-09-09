"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
exports.tokenizeNaturalQuery = tokenizeNaturalQuery;
exports.expandNaturalTerms = expandNaturalTerms;
exports.rerankNaturalResults = rerankNaturalResults;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../events/events.service");
const users_service_1 = require("../users/users.service");
const TERM_SYNONYMS = {
    call: ['phone', 'ring', 'dial'],
    phone: ['call', 'dial'],
    text: ['message', 'sms'],
    message: ['text', 'sms'],
    meeting: ['met', 'meet', 'appointment'],
    meet: ['meeting', 'met'],
    note: ['memo', 'journal'],
    car: ['drive', 'drove', 'vehicle'],
    flight: ['plane', 'travel'],
    hotel: ['stay', 'lodging'],
};
function tokenizeNaturalQuery(query) {
    return query
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length > 1)
        .slice(0, 8);
}
function expandNaturalTerms(terms) {
    const expanded = new Set(terms);
    for (const term of terms) {
        for (const synonym of TERM_SYNONYMS[term] ?? []) {
            expanded.add(synonym);
        }
    }
    return Array.from(expanded);
}
function ageInDays(occurredAt, referenceDate) {
    if (!occurredAt) {
        return 3650;
    }
    return Math.max(0, (referenceDate.getTime() - occurredAt.getTime()) / (1000 * 60 * 60 * 24));
}
function rerankNaturalResults(results, query, terms, referenceDate = new Date()) {
    const expandedTerms = expandNaturalTerms(terms);
    const normalizedQuery = query.toLowerCase().trim();
    return results
        .map((entry) => {
        const corpus = [entry.event.title, entry.event.detail, entry.event.searchText, entry.event.source]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        let lexicalBoost = 0;
        for (const term of terms) {
            if (corpus.includes(term)) {
                lexicalBoost += 1.5;
            }
        }
        for (const term of expandedTerms) {
            if (!terms.includes(term) && corpus.includes(term)) {
                lexicalBoost += 0.5;
            }
        }
        if (normalizedQuery.length > 3 && corpus.includes(normalizedQuery)) {
            lexicalBoost += 3;
        }
        const recencyBoost = Math.max(0, 2 - ageInDays(entry.event.occurredAt, referenceDate) / 30);
        return {
            ...entry,
            score: entry.score + lexicalBoost + recencyBoost,
        };
    })
        .sort((a, b) => b.score - a.score)
        .filter((entry) => entry.score > 0);
}
let SearchService = class SearchService {
    eventsService;
    usersService;
    constructor(eventsService, usersService) {
        this.eventsService = eventsService;
        this.usersService = usersService;
    }
    async keyword(user, dto) {
        const results = await this.eventsService.searchKeyword(user.userId, dto.query.trim(), dto.limit ?? 20);
        return {
            mode: 'keyword',
            query: dto.query,
            count: results.length,
            results,
        };
    }
    async natural(user, dto) {
        const account = await this.usersService.findById(user.userId);
        if (!account?.retrievalOptIn) {
            throw new common_1.ForbiddenException('Natural-language retrieval is disabled for this account');
        }
        const terms = tokenizeNaturalQuery(dto.query);
        let ranked = [];
        try {
            ranked = await this.eventsService.searchNatural(user.userId, dto.query.trim(), dto.limit ?? 20);
        }
        catch {
            const keywordResults = await this.eventsService.searchKeyword(user.userId, expandNaturalTerms(terms).join(' '), Math.max(dto.limit ?? 20, 40));
            ranked = keywordResults.map((event) => ({ event, score: 0 }));
        }
        ranked = rerankNaturalResults(ranked, dto.query, terms).slice(0, dto.limit ?? 20);
        return {
            mode: 'retrieval-first',
            query: dto.query,
            rationale: ranked.length > 0
                ? 'MySQL full-text retrieval over projected text fields with keyword-overlap fallback'
                : 'No projected text matched the retrieval query',
            count: ranked.length,
            results: ranked,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        users_service_1.UsersService])
], SearchService);
//# sourceMappingURL=search.service.js.map