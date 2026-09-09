import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { KeywordSearchDto } from './dto/keyword-search.dto';
import { NaturalSearchDto } from './dto/natural-search.dto';

@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiTags('search')
@ApiBearerAuth()
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Post('keyword')
	@ApiOperation({ summary: 'Run keyword search over projected text fields' })
	keyword(@CurrentUser() user: RequestUser, @Body() dto: KeywordSearchDto) {
		return this.searchService.keyword(user, dto);
	}

	@Post('natural')
	@ApiOperation({ summary: 'Run retrieval-first natural-language search (requires opt-in)' })
	natural(@CurrentUser() user: RequestUser, @Body() dto: NaturalSearchDto) {
		return this.searchService.natural(user, dto);
	}
}
