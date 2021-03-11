import { TestBed } from '@angular/core/testing';

import { MyValidationsService } from './my-validations.service';

describe('MyValidationsService', () => {
  let service: MyValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
