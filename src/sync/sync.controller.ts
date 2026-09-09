import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { PushSyncDto } from './dto/push-sync.dto';
import { PullSyncDto } from './dto/pull-sync.dto';

@Controller('sync')
@UseGuards(JwtAuthGuard)
@ApiTags('sync')
@ApiBearerAuth()
export class SyncController {
	constructor(private readonly syncService: SyncService) {}

	@Post('push')
	@ApiOperation({ summary: 'Push encrypted event batch with conflict handling' })
	push(@CurrentUser() user: RequestUser, @Body() dto: PushSyncDto) {
		return this.syncService.push(user, dto);
	}

	@Get('pull')
	@ApiOperation({ summary: 'Pull incremental sync changes since optional cursor date' })
	pull(@CurrentUser() user: RequestUser, @Query() dto: PullSyncDto) {
		return this.syncService.pull(user, dto);
	}
}
