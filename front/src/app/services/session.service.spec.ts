import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import {SessionInformation} from '../interfaces/sessionInformation.interface'

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  const mockUser: SessionInformation = {
    token: 'token',
    type: 'Bearer',
    id: 1,
    username: 'test',
    firstName: 'test',
    lastName: 'test',
    admin: true,
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be logged in with correct credentials', () => {
    service.logIn(mockUser)
    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toBe(mockUser);
  });

  it('should be logged in with correct credentials', () => {
    service.logIn(mockUser)
    service.logOut()
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should return observable of isLogged', () => {
    service.logIn(mockUser);

    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);
    })
  })
});
