import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule,
        NgbDropdownModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have brand name "NicoWork"', () => {
    const brandElement = fixture.nativeElement.querySelector('.navbar-brand');
    expect(brandElement.textContent).toContain('NicoWork');
  });

  it('should have login and register buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.auth-buttons .btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Login');
    expect(buttons[1].textContent).toContain('Cadastre-se');
  });
});