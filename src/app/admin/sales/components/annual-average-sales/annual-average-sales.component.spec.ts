import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualAverageSalesComponent } from './annual-average-sales.component';

describe('AnnualAverageSalesComponent', () => {
  let component: AnnualAverageSalesComponent;
  let fixture: ComponentFixture<AnnualAverageSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualAverageSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualAverageSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
