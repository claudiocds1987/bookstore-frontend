import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialPanelComponent } from './editorial-panel.component';

describe('EditorialPanelComponent', () => {
  let component: EditorialPanelComponent;
  let fixture: ComponentFixture<EditorialPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
