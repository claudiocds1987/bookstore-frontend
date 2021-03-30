import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulPurchaseComponent } from './successful-purchase.component';

describe('SuccessfulPurchaseComponent', () => {
  let component: SuccessfulPurchaseComponent;
  let fixture: ComponentFixture<SuccessfulPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessfulPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
