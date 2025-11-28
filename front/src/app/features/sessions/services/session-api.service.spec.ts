import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Session } from "../interfaces/session.interface";

import { SessionApiService } from './session-api.service';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  const mockSession: Session = {
    id: 1,
    name: 'session',
    description: 'test session',
    date: new Date(),
    teacher_id: 1,
    users: [1],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const mockSessions: Session[] = [mockSession];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('all should return', () => {
    service.all().subscribe(resp => expect(resp.length).toBe(1))
    const req = httpMock.expectOne("api/session");
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions)
  })

  it('detail should return session detail', () => {
    service.detail('1').subscribe(resp => expect(resp).toBe(mockSession))
    const req = httpMock.expectOne("api/session/1");
    expect(req.request.method).toBe('GET');
    req.flush(mockSession)
  })

  it('delete should delete', () => {
    service.delete('1').subscribe(resp => expect(resp).toBeTruthy())
    const req = httpMock.expectOne("api/session/1");
    expect(req.request.method).toBe('DELETE');
    req.flush({})
  })

  it('create should create', () => {
    service.create(mockSession).subscribe(resp => expect(resp).toBe(mockSession))
    const req = httpMock.expectOne("api/session");
    expect(req.request.method).toBe('POST');
    req.flush(mockSession)
  })

  it('update should update', () => {
    service.update('1', mockSession).subscribe(resp => expect(resp).toBe(mockSession))
    const req = httpMock.expectOne("api/session/1");
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession)
  })

  it('participate should Post', () => {
    service.participate('1', '1').subscribe(resp => expect(resp).toBeTruthy())
    const req = httpMock.expectOne("api/session/1/participate/1");
    expect(req.request.method).toBe('POST');
    req.flush({})
  })

  it('unparticipate should delete', () => {
    service.unParticipate('1', '1').subscribe(resp => expect(resp).toBeTruthy())
    const req = httpMock.expectOne("api/session/1/participate/1");
    expect(req.request.method).toBe('DELETE');
    req.flush({})
  })
});
