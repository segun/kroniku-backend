import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { SyncEvent } from '../events/entities/sync-event.entity';
import { UsersService } from '../users/users.service';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { KeywordSearchDto } from './dto/keyword-search.dto';
import { NaturalSearchDto } from './dto/natural-search.dto';

const TERM_SYNONYMS: Record<string, string[]> = {
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

export interface RankedSearchResult {
	event: SyncEvent;
	score: number;
}

export function tokenizeNaturalQuery(query: string): string[] {
	return query
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, ' ')
		.split(/\s+/)
		.map((term) => term.trim())
		.filter((term) => term.length > 1)
		.slice(0, 8);
}

export function expandNaturalTerms(terms: string[]): string[] {
	const expanded = new Set<string>(terms);
	for (const term of terms) {
		for (const synonym of TERM_SYNONYMS[term] ?? []) {
			expanded.add(synonym);
		}
	}
	return Array.from(expanded);
}

function ageInDays(occurredAt: Date | null, referenceDate: Date): number {
	if (!occurredAt) {
		return 3650;
	}

	return Math.max(0, (referenceDate.getTime() - occurredAt.getTime()) / (1000 * 60 * 60 * 24));
}

export function rerankNaturalResults(
	results: RankedSearchResult[],
	query: string,
	terms: string[],
	referenceDate: Date = new Date(),
): RankedSearchResult[] {
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

@Injectable()
export class SearchService {
	constructor(
		private readonly eventsService: EventsService,
		private readonly usersService: UsersService,
	) {}

	async keyword(user: RequestUser, dto: KeywordSearchDto) {
		const results = await this.eventsService.searchKeyword(
			user.userId,
			dto.query.trim(),
			dto.limit ?? 20,
		);

		return {
			mode: 'keyword',
			query: dto.query,
			count: results.length,
			results,
		};
	}

	async natural(user: RequestUser, dto: NaturalSearchDto) {
		const account = await this.usersService.findById(user.userId);
		if (!account?.retrievalOptIn) {
			throw new ForbiddenException('Natural-language retrieval is disabled for this account');
		}

		const terms = tokenizeNaturalQuery(dto.query);

		let ranked: RankedSearchResult[] = [];

		try {
			ranked = await this.eventsService.searchNatural(user.userId, dto.query.trim(), dto.limit ?? 20);
		} catch {
			const keywordResults = await this.eventsService.searchKeyword(
				user.userId,
				expandNaturalTerms(terms).join(' '),
				Math.max(dto.limit ?? 20, 40),
			);

			ranked = keywordResults.map((event) => ({ event, score: 0 }));
		}

		ranked = rerankNaturalResults(ranked, dto.query, terms).slice(0, dto.limit ?? 20);

		return {
			mode: 'retrieval-first',
			query: dto.query,
			rationale:
				ranked.length > 0
					? 'MySQL full-text retrieval over projected text fields with keyword-overlap fallback'
					: 'No projected text matched the retrieval query',
			count: ranked.length,
			results: ranked,
		};
	}
}
