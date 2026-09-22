import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { RequestUser } from '../common/interfaces/request-user.interface';
import { CreateNamedPlaceDto } from './dto/create-named-place.dto';
import { NamedPlace } from './entities/named-place.entity';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(NamedPlace)
    private readonly placesRepository: Repository<NamedPlace>,
  ) {}

  async list(user: RequestUser): Promise<NamedPlace[]> {
    return this.placesRepository.find({
      where: { userId: user.userId },
      order: { createdAt: 'ASC' },
    });
  }

  async create(user: RequestUser, dto: CreateNamedPlaceDto): Promise<NamedPlace> {
    const place = this.placesRepository.create({
      userId: user.userId,
      name: dto.name.trim(),
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
    return this.placesRepository.save(place);
  }
}
