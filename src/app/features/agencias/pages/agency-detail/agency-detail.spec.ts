import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDetailComponent } from './agency-detail';

describe('AgencyDetailComponent', () => {
  let component: AgencyDetailComponent;
  let fixture: ComponentFixture<AgencyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgencyDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
