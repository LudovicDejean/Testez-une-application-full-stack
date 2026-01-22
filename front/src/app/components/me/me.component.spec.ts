import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

import { MeComponent } from './me.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let sessionService: SessionService;
  let userService: UserService;
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
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    sessionService = TestBed.inject(SessionService)
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    sessionService.sessionInformation = mockSession;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('back sould go to home', () => {
    let routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    sessionService.sessionInformation = mockSession;
    let userSpy = jest.spyOn(userService, "getById").mockImplementation((id) => {
      return of({
        id: 1,
        email: 'test',
        lastName: 'test',
        firstName: 'test',
        admin: true,
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    })
    fixture.ngZone?.run(() => {
      router.initialNavigation();
      router.navigate([""]);
      router.navigate(["/me"]);
      expect(routerSpy).toBeCalledWith(['/me'])
      component.ngOnInit()
    });
    component.back();
    expect(routerSpy).toBeCalledWith([''])
  })

  it('delete should delete user', () => {
    let routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    sessionService.sessionInformation = mockSession;
    let usergetSpy = jest.spyOn(userService, "getById").mockImplementation((id) => {
      return of({
        id: 1,
        email: 'test',
        lastName: 'test',
        firstName: 'test',
        admin: true,
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    })
    fixture.ngZone?.run(() => {
      router.initialNavigation();
      router.navigate([""]);
      router.navigate(["/me"]);
      expect(routerSpy).toBeCalledWith(['/me'])
      component.ngOnInit()
    });
    let userSpy = jest.spyOn(userService, 'delete');
    let sessionSpy = jest.spyOn(sessionService, 'logOut');
    component.delete();
    httpMock.expectOne(req => req.url === "api/user/1" && req.method === "DELETE").flush({});
  })
});
