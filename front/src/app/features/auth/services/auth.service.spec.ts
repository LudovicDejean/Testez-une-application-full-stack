import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface'
import { LoginRequest } from '../interfaces/loginRequest.interface'
import { SessionInformation } from "src/app/interfaces/sessionInformation.interface";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  let mockRegister: RegisterRequest = {
    email: "test@test.com",
    firstName: "test",
    lastName: "test",
    password: "test1234"
  };

  const mockLogin: LoginRequest = {
    email: "test@test.com",
    password: "test1234"
  };
  const mockSession: SessionInformation = {
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
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('register should register', () => {
    service.register(mockRegister).subscribe(resp => expect(resp).toBeTruthy())
    const req = httpMock.expectOne("api/auth/register");
    expect(req.request.method).toBe('POST');
    req.flush(mockRegister)
  });

  it('login should login', () => {
    service.login(mockLogin).subscribe(resp => expect(resp).toBe(mockSession))
    const req = httpMock.expectOne("api/auth/login");
    expect(req.request.method).toBe('POST');
    req.flush(mockSession)
  });
});
