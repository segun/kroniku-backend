import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateNamedPlaceDto } from './dto/create-named-place.dto';
import { PlacesService } from './places.service';

@Controller('v1/me/places')
@UseGuards(JwtAuthGuard)
@ApiTags('places')
@ApiBearerAuth()
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  @ApiOperation({ summary: 'List the authenticated user named places' })
  list(@CurrentUser() user: RequestUser) {
    return this.placesService.list(user);
  }

  @Post()
  @ApiOperation({ summary: 'Name a new place for the authenticated user' })
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateNamedPlaceDto) {
    return this.placesService.create(user, dto);
  }
}
