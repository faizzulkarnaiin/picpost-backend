import { Injectable } from '@nestjs/common';

@Injectable()
export class LatihanService {
    hello() {
        return 'Hello world assalamualaikum'
    };

     faiz() {
        return {
            name: 'faiz',
            age: 15,
            school: 'smk mq'
        }
     };

}
