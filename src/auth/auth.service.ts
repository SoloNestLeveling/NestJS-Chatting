import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UsersModel } from 'src/users/entity/users.entity';
import { HASH_ROUND_KEY, JWT_SECRET_KEY } from 'src/common/const/env-path.const';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) { }


    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefresh: boolean) {

        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefresh ? 'refresh' : 'access'
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(JWT_SECRET_KEY),
            expiresIn: isRefresh ? 3600 : 300
        });
    };


    returnToken(user: Pick<UsersModel, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true)
        };
    };


    async registerUserWithEmail(dto: CreateUserDto) {

        const hash = await bcrypt.hash(
            dto.password,
            parseInt(this.configService.get<string>(HASH_ROUND_KEY)),
        );

        const user = await this.usersService.createUser({
            ...dto,
            password: hash
        });

        return this.returnToken(user);
    };



    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {

        const existEmail = await this.usersService.getUserByEmail(user.email);

        if (!existEmail) {
            throw new BadRequestException('존재하지 않는 이메일입니다.')
        };

        const passOk = bcrypt.compare(user.password, existEmail.password);


        if (!passOk) {
            throw new BadRequestException('패스워드가 틀렸습니다.')
        };

        return existEmail;

    };


    async loginUserWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
        const result = await this.authenticateWithEmailAndPassword(user);
        return this.returnToken(result);
    };



    extractTokenFromHeader(header: string, isBearer: boolean) {
        const split = header.split(' ')
        const prefix = isBearer ? 'Bearer' : 'Basic';

        if (split.length !== 2 || split[0] !== prefix) {
            throw new UnauthorizedException('잘못된 토큰값입니다.')
        };

        const token = split[1];

        return token;

    };


    decodeToken(base64String: string) {
        const decode = Buffer.from(base64String, 'base64').toString('utf-8');
        const split = decode.split(':');

        if (split.length !== 2) {
            throw new UnauthorizedException('잘못된 토큰값입니다.(de)')
        };

        const email = split[0];
        const password = split[1];

        return {
            email,
            password,
        };
    };


    loginUserWithToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, false);
        const result = this.decodeToken(token);
        return this.loginUserWithEmail(result);
    };


    async verifyToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get<string>(JWT_SECRET_KEY)
            });
            return payload;

        } catch (e) {
            throw new UnauthorizedException('잘못된 토큰이거나, 토큰이 만료되었습니다.')
        };
    };

    async rotateToken(token: string, isRefresh: boolean) {

        const verify = await this.verifyToken(token);

        return this.signToken({
            ...verify
        }, isRefresh);

    };

    async createAccessToken(rawToken: string) {
        const token = this.extractTokenFromHeader(rawToken, true)
        const newAccessToken = await this.rotateToken(token, false)
        return {
            accessToken: newAccessToken

        };
    };


    async createRefreshToken(rawToken: string) {
        const token = this.extractTokenFromHeader(rawToken, true)
        const newRefreshToken = await this.rotateToken(token, true)
        return {
            accessToken: newRefreshToken

        };
    };
}
