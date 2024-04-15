import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { User } from 'src/users/decorator/user-id.decorator';
import { UsersModel } from 'src/users/entity/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register/email')
  registerUser(
    @Body() dto: CreateUserDto
  ) {
    return this.authService.registerUserWithEmail(dto);
  };

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  loginUser(
    @Headers('authorization') rawToken: string,
  ) {
    return this.authService.loginUserWithToken(rawToken);
  };





}
