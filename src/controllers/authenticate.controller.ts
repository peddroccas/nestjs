import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcryptjs'
import { AuthenticateDTO, authenticateSchema } from 'src/DTOs/authenticate.dto'
import { CreateAccountDTO, createAccountSchema } from 'src/DTOs/create-user.dto'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private db: PrismaService,
    private jwt: JwtService
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async handle(@Body() body: AuthenticateDTO) {
    const { email, password } = body

    const user = await this.db.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}