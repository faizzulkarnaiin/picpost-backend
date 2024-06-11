import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FollowingService } from 'src/app/following/following.service';

@Injectable()
export class IsNotSelfFollowGuard implements CanActivate {
  constructor(private readonly followingService: FollowingService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const followerId = request.user.id; // asumsikan Anda mendapatkan id dari user yang login
    const followingId = request.params.id; // asumsikan Anda mendapatkan id dari parameter

    return this.followingService.canFollow(followerId, followingId);
  }
}
