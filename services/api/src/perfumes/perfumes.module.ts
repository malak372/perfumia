import { Module } from '@nestjs/common';
import { PerfumesService } from './perfumes.service.js';
import { PerfumesController } from './perfumes.controller.js';

@Module({
  controllers: [PerfumesController],
  providers: [PerfumesService],
})
export class PerfumesModule { }