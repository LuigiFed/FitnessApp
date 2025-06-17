import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProgressComponent } from './show-progress.component';

describe('ShowProgressComponent', () => {
  let component: ShowProgressComponent;
  let fixture: ComponentFixture<ShowProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
