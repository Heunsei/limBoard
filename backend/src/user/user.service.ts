import * as bcrypt from 'bcrypt';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {BadRequestException, Injectable} from '@nestjs/common';

import {UserEntity} from "./entities/user.entity";

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserResponseDto, UserDetailResponseDto } from './dto/user-response.dto';
import {ConfigService} from "@nestjs/config";
import {envVariablesKeys} from "../common/const/env.const";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {password} = createUserDto;

    const hashedPassword = await bcrypt.hash(password, this.configService.get<number>(envVariablesKeys.hashRounds) as number )

    try {
      const newUser = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      return new UserResponseDto(newUser);
    } catch (error) {
      // PostgreSQL 유니크 제약조건 위반 에러 처리
      if (error.code === '23505') { // unique_violation
        if (error.constraint?.includes('email') || error.detail?.includes('email')) {
          throw new BadRequestException("이미 존재하는 이메일입니다");
        }
        if (error.constraint?.includes('nickname') || error.detail?.includes('nickname')) {
          throw new BadRequestException("이미 존재하는 닉네임입니다");
        }
        throw new BadRequestException("중복된 정보가 존재합니다");
      }
      
      // 다른 데이터베이스 에러
      throw new BadRequestException("사용자 생성 중 오류가 발생했습니다");
    }
  }

  // 외부 API용 - 민감정보 제거된 응답
  async findUser(findUserDto: FindUserDto) {
    const user = await this.findUserRaw(findUserDto);
    return new UserResponseDto(user);
  }

  // 상세정보가 필요한 경우 (createdAt, updatedAt 포함)
  async findUserDetail(findUserDto: FindUserDto) {
    const user = await this.findUserRaw(findUserDto);
    return new UserDetailResponseDto(user);
  }

  // 내부 로직용 - 원본 UserEntity 반환
  async findUserRaw(findUserDto: FindUserDto) {
    const { type, value } = findUserDto;
    
    const findUser = await this.userRepository.findOne({
      where: type === 'email' ? { email: value } : { id: value }
    });

    if(!findUser) {
      throw new BadRequestException(`사용자를 찾을 수 없습니다: ${value}`);
    }

    return findUser;
  }

  async findUserById(id: string) {
    return this.findUserRaw({ type: 'id', value: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findUserById(id);

    await this.userRepository.update(id, updateUserDto);

    const updatedUser = await this.findUserById(id);
    return new UserResponseDto(updatedUser);
  }

  async remove(id: string) {
    await this.findUserById(id);

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(`유저 삭제도중 문제가 발생했습니다, error : ${error}`);
    }

    return id;
  }
}
