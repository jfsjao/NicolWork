import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ContactComponent } from './contact.component';
import { ApiService } from '../../core/api.service';
import { ClipboardService } from '../../core/services/clipboard/clipboard.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        {
          provide: ApiService,
          useValue: {
            sendContact: () => of({ message: 'Mensagem enviada com sucesso.' })
          }
        },
        {
          provide: ClipboardService,
          useValue: {
            copyToClipboard: async () => true
          }
        },
        {
          provide: ToastrService,
          useValue: {
            error: () => {},
            success: () => {},
            warning: () => {}
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
