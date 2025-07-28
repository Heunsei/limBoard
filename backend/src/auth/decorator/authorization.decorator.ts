import {BadRequestException, createParamDecorator} from "@nestjs/common";

export const Authorization = createParamDecorator(
    (data, context) => {
        const req = context.switchToHttp().getRequest();

        if(!req.headers['authorization']){
            throw new BadRequestException('로그인 정보를 입력해 주세요')
        }

        return req.headers['authorization'];
    }
)