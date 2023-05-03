import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getWelcome(): string {
    return 'Welcome to Study International CMS API!';
  }

  getSecretKey(): string {
    return this.configService.get('SECRET_KEY'); // read environment variable
  }
}
