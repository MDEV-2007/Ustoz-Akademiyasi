import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const botTokenHeader = request.headers['x-bot-api-token'];
    const configuredBotToken = this.configService.get<string>('bot.apiToken');

    if (
      configuredBotToken &&
      typeof botTokenHeader === 'string' &&
      botTokenHeader.trim() === configuredBotToken.trim()
    ) {
      request.user = {
        id: 'bot-admin-service',
        fullName: 'Telegram Bot Service',
        email: 'bot@ustozakademiyasi.uz',
        role: 'SUPER_ADMIN',
      };
      return true;
    }

    return super.canActivate(context);
  }
}
