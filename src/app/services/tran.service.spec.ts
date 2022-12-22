import { TestBed } from '@angular/core/testing';

import { TranService } from './tran.service';

describe('TranService', () => {
  let service: TranService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
