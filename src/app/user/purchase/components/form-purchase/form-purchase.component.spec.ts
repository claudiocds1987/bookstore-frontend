import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPurchaseComponent } from './form-purchase.component';

describe('FormPurchaseComponent', () => {
  let component: FormPurchaseComponent;
  let fixture: ComponentFixture<FormPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
