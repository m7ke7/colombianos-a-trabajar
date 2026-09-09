import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferListComponent } from './offer-list';

describe('OfferListComponent', () => {
  let component: OfferListComponent;
  let fixture: ComponentFixture<OfferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
