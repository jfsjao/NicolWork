import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAreaComponent } from './client-area.component';

describe('ClientAreaComponent', () => {
  let component: ClientAreaComponent;
  let fixture: ComponentFixture<ClientAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
