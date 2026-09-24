import { Controller, Get, Param } from '@nestjs/common';
import { PerfumesService } from './perfumes.service.js';

@Controller('perfumes')
export class PerfumesController {
  constructor(private readonly perfumesService: PerfumesService) {}

  @Get()
  findAll() {
    return this.perfumesService.findAll();
  }

  @Get(':sku')
  findBySku(@Param('sku') sku: string) {
    return this.perfumesService.findBySku(sku);
  }
}