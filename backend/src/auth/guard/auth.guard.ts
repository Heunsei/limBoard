/**
 * Authentication Guard
 * 
 * NestJS의 인증 가드로, 요청이 인증된 사용자에 의해 이루어졌는지 검증합니다.
 * @Public 데코레이터가 적용된 엔드포인트는 인증을 건너뛰고,
 * 그렇지 않은 경우 access 타입의 토큰이 있는지 확인합니다.
 */

import {Public} from "../decorator/public.decorator";

import {Reflector} from "@nestjs/core";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    /**
     * 인증 검증 로직을 수행하는 메인 메서드
     * @param context - NestJS 실행 컨텍스트 (요청 정보 포함)
     * @returns boolean - true면 접근 허용, false면 접근 거부
     */
    canActivate(context: ExecutionContext): boolean {
        // 현재 핸들러(컨트롤러 메서드)에 @Public 데코레이터가 적용되었는지 확인
        const isPublic = this.reflector.get(Public, context.getHandler());

        // @Public 데코레이터가 적용된 경우, 인증 없이 접근 허용
        if (isPublic) return true;

        // HTTP 요청 객체를 가져옴 (미들웨어에서 user 정보가 추가됨)
        const request = context.switchToHttp().getRequest();
        
        // 인증 검증: request.user가 존재하고 타입이 'access'인지 확인
        return !(!request.user || request.user.type !== 'access');
    }
}