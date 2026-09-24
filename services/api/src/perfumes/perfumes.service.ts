import { Injectable } from '@nestjs/common';
import { db } from '../prisma/db.js';

@Injectable()
export class PerfumesService {
  async findAll() {
    return db.orm.public.Perfume.all();
  }

  async findBySku(sku: string) {
    return db.orm.public.Perfume.where({ sku }).first();
  }
}