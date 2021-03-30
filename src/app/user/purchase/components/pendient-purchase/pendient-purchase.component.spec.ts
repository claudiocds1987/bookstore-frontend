import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendientPurchaseComponent } from './pendient-purchase.component';

describe('PendientPurchaseComponent', () => {
  let component: PendientPurchaseComponent;
  let fixture: ComponentFixture<PendientPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendientPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendientPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
