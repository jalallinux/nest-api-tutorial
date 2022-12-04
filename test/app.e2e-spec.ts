import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test} from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum'
import { AuthLoginDto, AuthRegisterDto } from '../src/auth/dto';
import { UserUpdateDto, UserUpdatePasswordDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({whitelist: true}))

    await app.init()
    await app.listen(8001)

    prisma = app.get(PrismaService)
    await prisma.cleanDB()

    pactum.request.setBaseUrl('http://localhost:8001')
  })

  afterAll(async () => {
    app.close()
  })

  describe('Auth', () => {
    describe('Register', () => {
      it("Shoud throw if any field empty", () => {
        const dto: AuthRegisterDto = {
          firstname: '',
          lastname: '',
          email: '',
          password: ''
        }
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectBody({
            statusCode: 400,
            error: "Bad Request",
            message: [
              "firstname should not be empty",
              "lastname should not be empty",
              "email should not be empty",
              "email must be an email",
              "password must be longer than or equal to 6 characters",
              "password should not be empty"
            ]
          })
          .expectStatus(400)
      })
      it("Shoud register", () => {
        const dto: AuthRegisterDto = {
          firstname: 'Jalal',
          lastname: 'LinuX',
          email: 'smjjalalzadeh93@gmail.com',
          password: '123456'
        }
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201)
          .stores('user_access_token', 'data.access_token')
          .stores('user_password', dto.password)
      })
    })

    describe('Login', () => {
      it('Shoud throw with wrong password', () => {
        const dto: AuthLoginDto = {
          email: 'smjjalalzadeh93@gmail.com',
          password: 'wrong-password'
        }
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(403)
      })
      it('Shoud login', () => {
        const dto: AuthLoginDto = {
          email: 'smjjalalzadeh93@gmail.com',
          password: '123456'
        }
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
      })
    })
  })

  describe('User', () => {
    describe('Me', () => {
      it('Shoud fecth me', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders('Authorization', `Bearer $S{user_access_token}`)
          .expectStatus(200)
      })
    })

    describe('Update', () => {
      it('Shoud update me profile', () => {
        const dto: UserUpdateDto = {
          firstname: 'new firstname',
          lastname: 'new lastname',
          email: 'newemail@gmail.com'
        }
        return pactum
          .spec()
          .patch('/user/update')
          .withBody(dto)
          .withHeaders('Authorization', `Bearer $S{user_access_token}`)
          .expectStatus(200)
      })
    })

    describe('UpdatePassword', () => {
      it('Shoud update me profile', () => {
        const dto: UserUpdatePasswordDto = {
          current_password: '123456',
          password: '123456789'
        }
        return pactum
          .spec()
          .patch('/user/update-password')
          .withBody(dto)
          .withHeaders('Authorization', `Bearer $S{user_access_token}`)
          .expectStatus(200)
          .inspect()
      })
    })
  })

  describe('Bookmark', () => {
    
  })
})