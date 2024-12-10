import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PageQueryDTO, pageQuerySchema } from '@/DTOs/page-query.dto'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class GetRecentQuestionsController {
  constructor(private db: PrismaService) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQuerySchema)) page: PageQueryDTO
  ) {
    const perPage = 20
    const questions = await this.db.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
