import { Controller, Get, Param, Query } from '@nestjs/common';
import { EducationService } from './education.service';

@Controller('api/education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get('categories')
  async getCategories() {
    return this.educationService.getCategories();
  }

  @Get()
  async getByCategory(@Query('category') category?: string) {
    return this.educationService.getByCategory(category);
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.educationService.getDetail(id);
  }
}
