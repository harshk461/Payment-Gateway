import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TokenizationClient } from './tokenization.client';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.TOKENIZATION_SERVER,
    }),
  ],
  providers: [TokenizationClient],
  exports: [TokenizationClient],
})
export class TokenizationModule {}
