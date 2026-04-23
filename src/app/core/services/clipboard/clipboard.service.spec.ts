import { TestBed } from '@angular/core/testing';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('copyToClipboard', () => {
    it('should resolve to true when copy is successful', async () => {
      // Mock the clipboard API
      spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
      
      const result = await service.copyToClipboard('test text');
      expect(result).toBeTrue();
    });

    it('should resolve to false when copy fails', async () => {
      // Mock a clipboard error
      spyOn(console, 'error');
      spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject('Clipboard error'));
      
      const result = await service.copyToClipboard('test text');
      expect(result).toBeFalse();
    });
  });
});
