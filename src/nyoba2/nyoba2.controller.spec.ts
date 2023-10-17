import { Test, TestingModule } from '@nestjs/testing';
import { Nyoba2Controller } from './nyoba2.controller';

describe('Nyoba2Controller', () => {
  let controller: Nyoba2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Nyoba2Controller],
    }).compile();

    controller = module.get<Nyoba2Controller>(Nyoba2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
