import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { PreferencesService } from './preferences.service';

@Controller('v1/me/preferences')
@UseGuards(JwtAuthGuard)
@ApiTags('preferences')
@ApiBearerAuth()
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user preferences' })
  getPreferences(@CurrentUser() user: RequestUser) {
    return this.preferencesService.getPreferences(user);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the authenticated user preferences' })
  updatePreferences(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.preferencesService.updatePreferences(user, dto);
  }
}
