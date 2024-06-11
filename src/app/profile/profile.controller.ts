import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './profile.dto';
@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Post('create')
  create(@Body() payload: CreateProfileDto) {
    return this.profileService.createProfile(payload);
  }
  @Get('listById')
  getProfileByUser() {
    return this.profileService.getProfileByUser();
  }
}
