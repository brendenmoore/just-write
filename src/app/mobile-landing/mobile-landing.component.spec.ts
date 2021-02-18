import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLandingComponent } from './mobile-landing.component';

describe('MobileLandingComponent', () => {
  let component: MobileLandingComponent;
  let fixture: ComponentFixture<MobileLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
