import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PageQueryDTO, pageQuerySchema } from 'src/DTOs/page-query.dto'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class GetRecentQuestionsController {
  constructor(private db: PrismaService) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQuerySchema)) page: PageQueryDTO
  ) {
    const questions = await this.db.question.findMany({
      take: 1,
      skip: page - 1,
      orderBy: { createdAt: 'desc' },
    })

    return { questions }
  }
}
