import {BadRequestException, Injectable, NestMiddleware, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {envVariablesKeys} from "../../common/const/env.const";

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async use(req: any, next: (error?: any) => void) {
        const authHeader = req.headers['authorization'];

        if(!authHeader) {
            next();
            return;
        }

        const token = this.validateBearerToken(authHeader);

        const decodedPayload = this.jwtService.decode(token);

        if (decodedPayload.type !== 'refresh' && decodedPayload.type !== 'access') {
            throw new UnauthorizedException('잘못된 토큰입니다');
        }

        try {
            const secretKey = decodedPayload.type === 'refresh'
                ? envVariablesKeys.refreshTokenSecret
                : envVariablesKeys.accessTokenSecret;

            req.user = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(secretKey),
            });

            next();
        } catch(e) {
            if (e.name === 'TokenExpiredError') {
                throw new UnauthorizedException('토큰이 만료되었습니다.');
            }
            next();
        }
    }

    validateBearerToken(rawToken: string) {
        const bearerSplit = rawToken.split(' ');

        if (bearerSplit.length !== 2) {
            throw new BadRequestException('토큰의 포맷이 잘못되었습니다');
        }

        const [bearer, token] = bearerSplit;

        if (bearer.toLowerCase() !== 'bearer') {
            throw new BadRequestException('토큰의 포맷이 잘못되었습니다');
        }
        return token;
    }
}