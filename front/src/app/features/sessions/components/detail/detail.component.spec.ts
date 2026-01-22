import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';

import { DetailComponent } from './detail.component';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { Session } from '../../interfaces/session.interface';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;

  const mockSessionInfo: SessionInformation = {
    token: 'token',
    type: 'Bearer',
    id: 1,
    username: 'test',
    firstName: 'test',
    lastName: 'test',
    admin: true,
  };
  const mockSession: Session = {
    id: 1,
    date: new Date(),
    description: "test",
    name: "Test",
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockTeacher: Teacher = {
    id: 1,
    firstName: "Test",
    lastName: "test",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
    })
      .compileComponents();
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    sessionService.sessionInformation = mockSessionInfo;
    teacherService = TestBed.inject(TeacherService)
    fixture = TestBed.createComponent(DetailComponent);
    router = TestBed.inject(Router);
    //httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.spyOn(sessionApiService, "detail").mockImplementation((_) => {
      return of(mockSession);
    });
    jest.spyOn(teacherService, "detail").mockImplementation((_) => {
      return of(mockTeacher);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('bacc should go to home', () => {
    let routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.ngZone?.run(() => {
      router.initialNavigation();
      router.navigate([""]);
      router.navigate(["/me"]);
      expect(routerSpy).toBeCalledWith(['/me'])
      component.ngOnInit()
      component.back();
    });
    expect(routerSpy).toBeCalledWith([''])
  })
});

