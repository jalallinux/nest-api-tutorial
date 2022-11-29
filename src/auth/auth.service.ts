import {Injectable} from '@nestjs/common';

@Injectable({})
export class AuthService {
    login() {
        return {
            message: 'I am login method',
        };
    }

    register() {
        return {
            message: 'I am register method',
        };
    }
}
