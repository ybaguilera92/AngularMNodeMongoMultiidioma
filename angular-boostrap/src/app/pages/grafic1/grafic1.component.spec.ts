import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grafic1Component } from './grafic1.component';

describe('Grafic1Component', () => {
  let component: Grafic1Component;
  let fixture: ComponentFixture<Grafic1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Grafic1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Grafic1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
