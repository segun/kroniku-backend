import { ExecutionContext } from '@nestjs/common';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly logger;
    handleRequest<TUser = unknown>(error: unknown, user: TUser, info: unknown, context: ExecutionContext): TUser;
    private authenticationReason;
}
export {};
