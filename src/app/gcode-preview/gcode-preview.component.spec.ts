import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GcodePreviewComponent } from './gcode-preview.component';

describe('GcodePreviewComponent', () => {
  let component: GcodePreviewComponent;
  let fixture: ComponentFixture<GcodePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GcodePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GcodePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
