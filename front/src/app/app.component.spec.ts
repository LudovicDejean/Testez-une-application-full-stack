import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';


describe('AppComponent', () => {
  let app: AppComponent;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it ('is logged should return true', () => {
    sessionService.isLogged = true;
    expect(app.$isLogged()).toBeTruthy();
  });

  it ('is logout should navigate to /', () => {
    let navSpy = jest.spyOn(router, 'navigate');
    sessionService.isLogged = true;
    app.logout();
    expect(navSpy).toBeCalledWith([''])
  });
});
