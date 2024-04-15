import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>
    ) { }


    async createUser(dto: CreateUserDto) {

        const existEmail = await this.usersRepository.exists({
            where: {
                email: dto.email
            }
        });


        if (existEmail) {
            throw new BadRequestException('이미 존재하는 이메일입니다.')
        };


        const existNickname = await this.usersRepository.exists({
            where: {
                nickname: dto.nickname
            }
        });

        if (existNickname) {
            throw new BadRequestException('이미 존재하는 닉네임입니다.')
        };

        const user = this.usersRepository.create({
            email: dto.email,
            password: dto.password,
            nickname: dto.nickname
        });

        const result = await this.usersRepository.save(user);

        return result;
    }


    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email,
            }
        });

        return user;
    };


    async getUserById(id: number) {

        const user = await this.usersRepository.findOneBy({ id });

        return user;
    }

}
