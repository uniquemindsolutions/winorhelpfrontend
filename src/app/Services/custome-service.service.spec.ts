import { TestBed } from '@angular/core/testing';

import { CustomeServiceService } from './custome-service.service';

describe('CustomeServiceService', () => {
  let service: CustomeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
