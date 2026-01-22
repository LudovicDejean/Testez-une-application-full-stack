import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface'

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  const mockTeacher1: Teacher = {
    id: 1,
    lastName: 'Teach',
    firstName: 'uno',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const mockTeacher2: Teacher = {
    id: 2,
    lastName: 'Teach',
    firstName: 'dos',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all', () => {
    service.all().subscribe(teachers => {
      expect(teachers).toContain(mockTeacher1);
      expect(teachers).toContain(mockTeacher2);
    })
    const request = httpMock.expectOne(`api/teacher`);
    expect(request.request.method).toBe('GET');
    request.flush([mockTeacher1, mockTeacher2]);
  })

  it('should retrieve teacher unos', () => {
    const teacher_id = '1';
    service.detail(teacher_id).subscribe(teachers => {
      expect(teachers).toBe(mockTeacher1);
    })
    const request = httpMock.expectOne(`api/teacher/${teacher_id}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockTeacher1);
  })
});
