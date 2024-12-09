import { ConflictException, UsePipes } from '@nestjs/common'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { CreateAccountDTO, createAccountSchema } from '@/DTOs/create-user.dto'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private db: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountDTO) {
    const { name, email, password } = body

    const userWithSameEmail = await this.db.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists'
      )
    }

    const hashedPassword = await hash(password, 8)

    await this.db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
