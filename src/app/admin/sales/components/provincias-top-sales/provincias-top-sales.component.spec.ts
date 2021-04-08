import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciasTopSalesComponent } from './provincias-top-sales.component';

describe('ProvinciasTopSalesComponent', () => {
  let component: ProvinciasTopSalesComponent;
  let fixture: ComponentFixture<ProvinciasTopSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinciasTopSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinciasTopSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
