import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { JobFormComponent } from './job-form';

describe('JobFormComponent', () => {
  let component: JobFormComponent;
  let fixture: ComponentFixture<JobFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to offers when cancel is pressed', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.cancelAndGoBack();

    expect(router.navigate).toHaveBeenCalledWith(['/offers']);
  });
});
