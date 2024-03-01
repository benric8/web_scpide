import { TestBed } from '@angular/core/testing';

import { LocalStorageUsuarioService } from './local-storage-usuario.service';

describe('LocalStorageUsuarioService', () => {
  let service: LocalStorageUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
