import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { ApiService, MeusPacksResponse, PackResponse } from '../api.service';
import { UserLibraryService } from './user-library.service';

describe('UserLibraryService', () => {
  let service: UserLibraryService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
      'getMeusPacks',
      'getPacksDestaque',
      'getAllPacks'
    ]);

    TestBed.configureTestingModule({
      providers: [
        UserLibraryService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(UserLibraryService);
  });

  it('treats a null plan response as gratuito without inventing owned packs', async () => {
    const meusPacks: MeusPacksResponse = {
      usuario_id: 7,
      plano_atual: null,
      packs: []
    };

    apiServiceSpy.getMeusPacks.and.returnValue(of(meusPacks));
    apiServiceSpy.getPacksDestaque.and.returnValue(of({ total: 0, packs: [] }));
    apiServiceSpy.getAllPacks.and.returnValue(of({ total: 0, packs: [] }));

    const library = await firstValueFrom(service.loadUserLibrary(7));

    expect(library.plan.slug).toBe('gratuito');
    expect(library.ownedPacks).toEqual([]);
    expect(library.allPacks).toEqual([]);
  });

  it('unlocks only packs returned by the backend library endpoint', async () => {
    const meusPacks: MeusPacksResponse = {
      usuario_id: 7,
      plano_atual: {
        id: 1,
        slug: 'gratuito',
        nome: 'Gratuito',
        status: 'ativo',
        iniciado_em: '2026-05-02T00:00:00.000Z',
        expira_em: null
      },
      packs: [
        {
          id: 30,
          slug: 'kit-streamer',
          nome: 'Kit Streamer',
          descricao: 'Kit gratis vinculado pelo backend.',
          capa_url: null,
          arquivo_url: null,
          tamanho_gb: null,
          principal: true,
          ativo: true
        }
      ]
    };
    const allPacks: PackResponse[] = [
      ...meusPacks.packs,
      {
        id: 31,
        slug: 'kit-youtube',
        nome: 'Kit YouTube',
        descricao: 'Kit gratis ainda nao retornado em meus packs.',
        capa_url: null,
        arquivo_url: null,
        tamanho_gb: null,
        principal: true,
        ativo: true
      }
    ];

    apiServiceSpy.getMeusPacks.and.returnValue(of(meusPacks));
    apiServiceSpy.getPacksDestaque.and.returnValue(of({ total: 2, packs: allPacks }));
    apiServiceSpy.getAllPacks.and.returnValue(of({ total: 2, packs: allPacks }));

    const library = await firstValueFrom(service.loadUserLibrary(7));
    const streamer = library.allPacks.find((pack) => pack.title === 'Kit Streamer');
    const youtube = library.allPacks.find((pack) => pack.title === 'Kit YouTube');

    expect(library.ownedPacks.map((pack) => pack.title)).toEqual(['Kit Streamer']);
    expect(streamer?.locked).toBeFalse();
    expect(youtube?.locked).toBeTrue();
  });
});
