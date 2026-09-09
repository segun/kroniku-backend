import { Repository } from 'typeorm';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { Device } from './entities/device.entity';
export declare class DevicesService {
    private readonly devicesRepository;
    constructor(devicesRepository: Repository<Device>);
    upsertForUser(userId: string, dto: RegisterDeviceDto): Promise<Device>;
    assertOwnership(deviceId: string, userId: string): Promise<void>;
    findByUserId(userId: string): Promise<Device[]>;
}
