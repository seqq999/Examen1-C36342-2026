import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaFormComponent } from './cita-form-component';

describe('CitaFormComponent', () => {
  let component: CitaFormComponent;
  let fixture: ComponentFixture<CitaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
