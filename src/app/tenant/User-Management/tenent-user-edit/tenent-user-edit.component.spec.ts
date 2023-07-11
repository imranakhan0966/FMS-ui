import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenentUserEditComponent } from './tenent-user-edit.component';

describe('TenentUserEditComponent', () => {
  let component: TenentUserEditComponent;
  let fixture: ComponentFixture<TenentUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenentUserEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenentUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
