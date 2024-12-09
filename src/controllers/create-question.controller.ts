import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import {
  CreateQuestionDTO,
  createQuestionSchema,
} from 'src/DTOs/create-question.dto'
import { UserTokenDTO } from 'src/DTOs/user-token.dto'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private db: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionSchema)) body: CreateQuestionDTO,
    @CurrentUser() user: UserTokenDTO
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = title.toLowerCase().trim()

    const slugAlreadyExists = await this.db.question.findUnique({
      where: { slug },
    })

    if (slugAlreadyExists) {
      throw new ConflictException('Question already exists')
    }

    await this.db.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
    return 'ok'
  }
}
