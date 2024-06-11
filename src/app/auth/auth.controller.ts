import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  BanUserDto,
  FindAllUser,
  GithubDto,
  GoogleDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateUserDto,
} from './auth.dto';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
import { get } from 'http';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }
  @Post('login/github')
  async githubLogin(@Body() payload: GithubDto) {
    return this.authService.loginWithGithub(payload);
  }
  @Post('login/google')
  async googleLogin(@Body() payload: GoogleDto) {
    return this.authService.loginWithGoogle(payload);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    // hasil validate dari jwt strategy akan ditambakan pada req.user. isi object req.user akan sama dengan payload dari jwt token. Silahkan coba console.log(req.user)
    const { id } = req.user;
    return this.authService.myProfile(id);
  }
  @UseGuards(JwtGuard)
  @Get('detail/:id')
  async userProfile(@Param('id') id: string) {
    return this.authService.myProfile(+id);
  }
  @UseGuards(JwtGuard) // impelementasi guard pada route , hal ini berarti endpoint profile hanya bisa diakses jika client membawa token
  @Put('profile/update')
  async update(@Req() req, @Body() payload: UpdateUserDto) {
    const { id } = req.user;
    return this.authService.updateProfile(+id, payload);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }
  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password/:user_id/:token') // url yang dibuat pada endpont harus sama dengan ketika kita membuat link pada service forgotPassword
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+user_id, token, payload);
  }
  @UseGuards(JwtGuard)
  @Get('list')
  async getUser(@Pagination() query: FindAllUser) {
    return this.authService.getAllUser(query);
  }
  @UseGuards(JwtGuard)
  @Put('ban/:id')
  banPost(@Param('id') id: string, @Body() payload: BanUserDto) {
    return this.authService.banUser(+id, payload);
  }
  @UseGuards(JwtGuard)
  @Put('unBan/:id')
  unBanPost(@Param('id') id: string, @Body() payload: BanUserDto) {
    return this.authService.unBanUser(+id, payload);
  }
  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  deletePost(@Param('id') id: string) {
    return this.authService.deleteUser(+id);
  }
}
