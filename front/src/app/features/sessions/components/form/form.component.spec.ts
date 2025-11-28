import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let router: Router;

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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatCardModule ,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [],
      declarations: [FormComponent]
    })
      .compileComponents();

    router = TestBed.inject(Router);
    sessionApiService = TestBed.inject(SessionApiService)
    sessionService = TestBed.inject(SessionService)
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionService.logIn({ id: 1, admin: false, firstName: "Test", lastName: "Test", token: "fake", type: "Bearer", username: "test@test.com" })
    fixture.ngZone?.run(() => router.initialNavigation());
    jest.spyOn(router, 'navigate').mockImplementation(async () => true);
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Form should be invalid when empty', () => {
    component.ngOnInit();
    expect(component.sessionForm?.invalid).toBeTruthy();
  })

  it('should call create method on submit', () => {
    let createcall = jest.spyOn(sessionApiService, "create");
    component.sessionForm?.setValue({
      name: 'Test Session',
      date: new Date().toISOString().split('T')[0],
      teacher_id: '1',
      description: 'Test Description'
    });
    component.submit();
    expect(createcall).toHaveBeenCalled();
  })

  it('should fill form on update submit', () => {
    let navigationSpy = jest.spyOn(router, 'navigate');
    jest.spyOn(router, 'url', 'get').mockReturnValue('/update');
    expect(router.url).toContain("update");
    let detail = jest.spyOn(sessionApiService, "detail").mockImplementation((_) => {
      return of(mockSession);
    });
    fixture.ngZone?.run(() => {
      component.ngOnInit()
      component.sessionForm?.setValue({
        name: 'Test update',
        date: '07/09/2025',
        teacher_id: '1',
        description: 'Test Description'
      });
      component.submit();
      fixture.detectChanges()
    })
    expect(detail).toHaveBeenCalled();
    expect(component.sessionForm).not.toBeNull();
    expect(component.onUpdate).toBeTruthy();
    expect(navigationSpy).toHaveBeenCalledWith(['/sessions']);
  });


  it('should navigate to /sessions on successful submit', () => {
    router.navigate(['session', 'create'])
    let navigationSpy = jest.spyOn(router, 'navigate');
    fixture.ngZone?.run(() => {
      let createcall = jest.spyOn(sessionApiService, "create").mockImplementation(() => {
        return of(mockSession);
      });
      component.ngOnInit()
      component.sessionForm?.setValue({
        name: 'Test Session',
        date: new Date().toISOString().split('T')[0],
        teacher_id: '1',
        description: 'Test Description'
      });
      component.submit();
      fixture.detectChanges()
      expect(createcall).toHaveBeenCalled();
    })
    expect(navigationSpy).toHaveBeenCalledWith(['/sessions']);
  });

});
