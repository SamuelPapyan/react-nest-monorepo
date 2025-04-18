import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new NotFoundException();
    if (!(await bcrypt.compare(pass, user.password)))
      throw new UnauthorizedException();
    const payload = {
      id: user._id,
      username: user.username,
      roles: user.roles,
      avatar: user.avatar
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
