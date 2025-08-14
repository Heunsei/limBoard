import * as bcrypt from 'bcrypt';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';

import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

import {UserEntity} from "../user/entities/user.entity";
import {envVariablesKeys} from "../common/const/env.const";
import {UserService} from "../user/user.service";
import {RegisterUserDto} from "./dto/registerUser.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){}

    async login(token: string){
        const {email, password} = this.parseBasicToken(token);

        const user = await this.authenticateUser(email, password);

        return {
            accessToken: await this.issueToken(user, false),
            refreshToken: await this.issueToken(user, true),
        }
    }

    async register(token: string, registerUserDto: RegisterUserDto){
        const {email, password} = this.parseBasicToken(token);

        return this.userService.create({
            email,
            password,
            ...registerUserDto
        });
    }

    // Basic 토큰을 입력받아 검증 후 email 과 password 를 반환
    parseBasicToken(token: string){
        const [basic, basicToken] = token.split(' ');

        if(basic.toLowerCase() !== 'basic'){
            throw new BadRequestException('Need Basic token')
        }

        const decodedToken = Buffer.from(basicToken, 'base64').toString('utf-8');

        const splitToken = decodedToken.split(':');

        if(splitToken.length !== 2){
            throw new BadRequestException('Invalid token')
        }

        const [email, password] = splitToken

        return {email, password};
    }

    async authenticateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {email},
        })

        if(!user){
            throw new UnauthorizedException('User does not exist');
        }

        const pass = await bcrypt.compare(password, user.password);

        if(!pass){
            throw new UnauthorizedException('User does not exist');
        }

        return user;
    }

    // 토큰을 발급해주는 함수
    async issueToken(user: {id: string, email: string}, isRefresh: boolean){
        const accessTokenSecret = this.configService.get<string>(envVariablesKeys.accessTokenSecret);
        const refreshTokenSecret = this.configService.get<string>(envVariablesKeys.refreshTokenSecret);

        return this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
                type: isRefresh ? 'refresh' : 'access',
            },
            {
                secret: isRefresh ? refreshTokenSecret : accessTokenSecret,
                expiresIn: isRefresh ? '24h' : 300,
            }
        )
    }

    async refreshToken(refreshToken: string) {
        const splitToken = refreshToken.split(' ');
        const refreshTokenSecret = this.configService.get<string>(envVariablesKeys.refreshTokenSecret);

        if(splitToken.length !== 2){
            throw new BadRequestException('Invalid refreshToken')
        }

        const [bearer, token] = splitToken;

        if(bearer.toLowerCase() !== 'bearer'){
            throw new UnauthorizedException('Invalid refreshToken')
        }

        try {
            const payload = this.jwtService.verify(token, {secret: refreshTokenSecret});

            const newPayload = {id: payload.sub, email: payload.email};

            const newAccessToken = await this.issueToken(newPayload, false);
            const newRefreshToken = await this.issueToken(newPayload, true);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            }
        } catch {
            throw new UnauthorizedException('Invalid refreshToken')
        }
    }
}
