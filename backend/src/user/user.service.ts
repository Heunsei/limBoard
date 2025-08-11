import * as bcrypt from 'bcrypt';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {BadRequestException, Injectable} from '@nestjs/common';

import {UserEntity} from "./entities/user.entity";

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    const {email, password} = createUserDto;

    const isEmailExist = await this.userRepository.findOne({
      where: { email },
    })

    if (isEmailExist) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, this.configService.get<number>(envVariablesKeys.hashRounds) as number )

    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser;
  }

  async findOne(id: string) {
    const findUser = await this.userRepository.findOne({
      where: { id },
    });

    if(!findUser) {
      throw new BadRequestException(`${id} not found`)
    }

    return findUser;
  }

  async findByEmail(email: string){
    const findUser = await this.userRepository.findOne({
      where: {email: email}
    })

    if(!findUser) {
      throw new BadRequestException(`${email} not found`);
    }

    return findUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {id}
    })

    if(!user) {
      throw new BadRequestException(`${id} not found`)
    }

    await this.userRepository.update(id, updateUserDto);

    return await this.userRepository.findOne({
      where: {id}
    });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: {id}
    })

    if(!user) {
      throw new BadRequestException(`${id} not found`)
    }

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(`유저 삭제도중 문제가 발생했습니다, error : ${error}`);
    }

    return id;
  }
}
