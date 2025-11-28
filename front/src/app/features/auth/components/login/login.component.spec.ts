import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';

import { LoginComponent } from './login.component';

describe('FormComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockSession: SessionInformation = {
    token: 'token',
    type: 'Bearer',
    id: 1,
    username: 'test',
    firstName: 'test',
    lastName: 'test',
    admin: true,
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideRouter([
          {path: 'sessions/create', component: LoginComponent},
          {path: 'sessions', redirectTo: 'themen'},
          {path: '**', redirectTo: 'themen', pathMatch: 'full'}
        ]),
      ],
      declarations: [LoginComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.ngZone?.run(() => {
      router.initialNavigation();
      router.navigate(["/login"]);
    });
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should login', () => {
    let loginSpy = jest.spyOn(authService, 'login');
    let routerSpy = jest.spyOn(router, 'navigate')
    expect(component).toBeTruthy();
    component.form?.setValue({
      email: "yoga@studio.com",
      password: "test!1234",
    });
    component.submit()
    expect(loginSpy).toBeCalledWith({
      email: "yoga@studio.com",
      password: "test!1234",
    });
    const request = httpMock.expectOne(`api/auth/login`);
    request.flush(mockSession);
    expect(routerSpy).toBeCalledWith(['/sessions']);
  });

  it('should create', () => {
    let loginSpy = jest.spyOn(authService, 'login');
    expect(component).toBeTruthy();
    component.form?.setValue({
      email: "yoga@studio.com",
      password: "test!1234",
    });
    component.submit()
    expect(loginSpy).toBeCalledWith({
      email: "yoga@studio.com",
      password: "test!1234",
    });
    const request = httpMock.expectOne(`api/auth/login`);
    request.flush(null, {status: 400, statusText: "hohoh"})
    expect(component.onError)
  });
});
