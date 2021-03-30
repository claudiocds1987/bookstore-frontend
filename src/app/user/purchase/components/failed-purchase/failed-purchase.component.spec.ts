import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedPurchaseComponent } from './failed-purchase.component';

describe('FailedPurchaseComponent', () => {
  let component: FailedPurchaseComponent;
  let fixture: ComponentFixture<FailedPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
