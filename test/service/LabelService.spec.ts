import { Test } from '@nestjs/testing';
import { ILabelIntegration } from 'src/integration/ILabelIntegration';
import { LabelIntegration } from 'src/integration/LabelIntegration';
import { LabelService } from 'src/service/LabelService';
import { ILabelService } from '../../src/service/ILabelService';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('LabelService', () => {
  const label = {
    id: '001',
    name: 'Test label',
  };
  const httpService = {
    get: jest.fn(),
  };
  const cacheManager = {
    get: jest.fn().mockResolvedValue(label),
    set: jest.fn(),
  };
  let labelIntegration: LabelIntegration;
  let labelService: LabelService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: HttpService, useValue: httpService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        {
          provide: ILabelIntegration,
          useClass: LabelIntegration,
        },
        {
          provide: ILabelService,
          useClass: LabelService,
        },
      ],
    }).compile();

    labelIntegration = moduleRef.get<LabelIntegration>(ILabelIntegration);
    labelService = moduleRef.get<LabelService>(ILabelService);
  });

  it('[LabelService] Find label', async () => {
    jest.spyOn(labelIntegration, 'getLabelById').mockResolvedValue(label);
    expect(await labelService.findById(label.id)).toBe(label);
  });

  it('[LabelService] Wrong label id', async () => {
    jest.spyOn(labelIntegration, 'getLabelById').mockImplementation(() => {
      throw new Error();
    });
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    await expect(async () => {
      return labelService.findById('wrongId');
    }).rejects.toThrow(Error);
  });
});
