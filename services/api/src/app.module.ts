import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PerfumesModule } from './perfumes/perfumes.module.js';

@Module({
  imports: [PerfumesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
