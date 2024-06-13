import { Test, TestingModule } from '@nestjs/testing';

describe('Start Product Test', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [],
    }).compile();
  });

  it('should be defined', () => {});
});
