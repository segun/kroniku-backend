import {
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdateRetrievalOptInDto } from './dto/update-retrieval-opt-in.dto';

@Controller('account')
@UseGuards(JwtAuthGuard)
@ApiTags('account')
@ApiBearerAuth()
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Patch('retrieval-opt-in')
	@ApiOperation({ summary: 'Enable or disable retrieval-first natural-language search' })
	setRetrievalOptIn(
		@CurrentUser() user: RequestUser,
		@Body() dto: UpdateRetrievalOptInDto,
	) {
		return this.accountService.setRetrievalOptIn(user, dto.enabled);
	}

	@Get('export')
	@ApiOperation({ summary: 'Export account data, devices, and synced events' })
	exportData(@CurrentUser() user: RequestUser) {
		return this.accountService.exportData(user);
	}

	@Delete()
	@ApiOperation({ summary: 'Delete account and all related data' })
	delete(@CurrentUser() user: RequestUser) {
		return this.accountService.deleteAccount(user);
	}
}
