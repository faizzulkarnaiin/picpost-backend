import { Test, TestingModule } from '@nestjs/testing';
import { NyobaService } from './nyoba2.service';

describe('NyobaService', () => {
  let service: NyobaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NyobaService],
    }).compile();

    service = module.get<NyobaService>(NyobaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
