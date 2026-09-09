import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ProviderLoginDto } from './dto/provider-login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('provider')
	@ApiOperation({ summary: 'Authenticate with verified Google or Apple identity token' })
	providerLogin(@Body() dto: ProviderLoginDto) {
		return this.authService.providerLogin(dto);
	}
}
