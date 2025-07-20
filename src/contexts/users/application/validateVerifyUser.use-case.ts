import { BadRequestException, Inject } from '@nestjs/common';
import {
    IUserRepository,
    IUserRepositoryToken,
} from '../domain/repositories/user.repository.interface';

export class ValidateVerifyUser {
    constructor(
        @Inject(IUserRepositoryToken)
        private readonly userRepository: IUserRepository,

    ) { }
    async execute(userId: number) {

        const result = await this.userRepository.findOneById(userId);
        console.log("🚀 ~ file: validateVerifyUser.use-case.ts:16 ~ ValidateVerifyUser ~ execute ~ result:", result)

        
        return {
            message: result.verified,
        };
    }
}
