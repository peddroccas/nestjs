import { ConflictException } from '@nestjs/common'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private db: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userWithSameEmail = await this.db.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists'
      )
    }

    await this.db.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
