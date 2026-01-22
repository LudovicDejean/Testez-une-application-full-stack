package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepo;

    @InjectMocks
    private TeacherService teacherSrvc;

    @Test
    public void testFindById_ReturnsTeacher() {
        // Data
        Long teacherId = 1L;
        Teacher expectedTeacher = new Teacher();
        expectedTeacher.setId(teacherId);
        // Mock
        when(teacherRepo.findById(teacherId)).thenReturn(Optional.of(expectedTeacher));
		// Action
        Teacher result = teacherSrvc.findById(teacherId);
		// Check
        assertEquals(expectedTeacher, result);
        verify(teacherRepo).findById(teacherId);
    }

    @Test
    public void testFindByInvalidId_ReturnsNull() {
        // Data
        Long teacherId = 999L;
        // Mock
        when(teacherRepo.findById(teacherId)).thenReturn(Optional.empty());
		// Action
        Teacher result = teacherSrvc.findById(teacherId);
		// Check
        assertNull(result);
    }

    @Test
    public void testFindAll_ReturnsAllTeachers() {
        // Data
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        List<Teacher> expectedTeachers = Arrays.asList(teacher1, teacher2);
		// Mock
        when(teacherRepo.findAll()).thenReturn(expectedTeachers);
 		// Action       
        List<Teacher> result = teacherSrvc.findAll();
		// Check
        assertEquals(expectedTeachers, result);
        verify(teacherRepo).findAll();
    }

    @Test
    public void testFindAll_ReturnsEmptyList() {
 		// Data
        List<Teacher> emptyList = Collections.emptyList();
 		// Mock
        when(teacherRepo.findAll()).thenReturn(emptyList);
 		// Action       
        List<Teacher> result = teacherSrvc.findAll();
		// Check
        assertTrue(result.isEmpty());
        verify(teacherRepo).findAll();
    }
}
