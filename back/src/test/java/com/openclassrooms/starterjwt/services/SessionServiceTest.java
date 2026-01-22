package com.openclassrooms.starterjwt.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

	@Mock
	private SessionRepository sessionRepo;

	@Mock
	private UserRepository userRepo;

	@InjectMocks
	private SessionService sessionSrvc;

	@Test
    public void testCreateSession_ShouldSucceed() {
        // Data
        Session session = Session.builder()
                .name("Test Session")
                .date(new Date())
                .description("Test session description")
                .build();

        Session savedSession = Session.builder()
                .id(1L)
                .name("Test Session")
                .date(session.getDate())
                .description("Test session description")
                .build();
		// Mock
        when(sessionRepo.save(session)).thenReturn(savedSession);
		// Actin
        Session createdSession = sessionSrvc.create(session);
		// Check 
        assertNotNull(createdSession);
        assertEquals(savedSession.getId(), createdSession.getId());
        assertEquals(session.getName(), createdSession.getName());
        assertEquals(session.getDate(), createdSession.getDate());
        assertEquals(session.getDescription(), createdSession.getDescription());
    }

    @Test
    public void testDeleteSessionById_ShouldSucceed() {
		// Data
        Long sessionId = 1L;
		// Mock
		// Actin
        sessionSrvc.delete(sessionId);
		// Check
        verify(sessionRepo).deleteById(sessionId);
    }

    @Test
    public void testGetSessionById_ShouldSucceed() {
        
        Long sessionId = 1L;
        Session expectedSession = Session.builder()
                .id(sessionId)
                .name("Test Session")
                .date(new Date())
                .description("Description de test")
                .build();

		// Mock
        when(sessionRepo.findById(sessionId)).thenReturn(java.util.Optional.of(expectedSession));

        
		// Action
        Session actualSession = sessionSrvc.getById(sessionId);
		// Check 
        assertNotNull(actualSession);
        assertEquals(expectedSession.getId(), actualSession.getId());
        verify(sessionRepo).findById(sessionId);
    }

    @Test
    public void testFindAllSessions_ShouldSucceeed() {
        // Data
        Session session1 = Session.builder()
                .id(1L)
                .name("Test Session 1")
                .date(new Date())
                .description("Test session 1 description")
                .build();

        Session session2 = Session.builder()
                .id(2L)
                .name("Test Session 2")
                .date(new Date())
                .description("Test sesssion 2 description")
                .build();

        List<Session> expectedSessions = Arrays.asList(session1, session2);
		// Mock
        when(sessionRepo.findAll()).thenReturn(expectedSessions);
		// Action
        List<Session> sessions = sessionSrvc.findAll();
		// Check 
        assertNotNull(sessions);
        assertEquals(2, sessions.size());
        verify(sessionRepo).findAll();
    }

    @Test
    public void testUpdateSession_UpdatesSession() {
        // Data
        Long sessionId = 1L;
        Session sessionToUpdate = Session.builder()
                .id(sessionId)
                .name("Test update session")
                .date(new Date())
                .description("Updated description")
                .build();
        // Mock
        when(sessionRepo.save(sessionToUpdate)).thenReturn(sessionToUpdate);
        // Action
        Session updatedSession = sessionSrvc.update(sessionId, sessionToUpdate);
        // Check
        assertNotNull(updatedSession);
        assertEquals(sessionId, updatedSession.getId());
        assertEquals("Test update session", updatedSession.getName());
    }

    @Test
    public void testParticipateSession_ShouldSucceed() {
		// Data
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = Session.builder()
                .id(sessionId)
                .name("Test Session")
                .date(new Date())
                .description("Test session description")
                .users(new ArrayList<>())
                .build();
		// Mock
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(sessionRepo.save(session)).thenReturn(session);
		// Action 
        sessionSrvc.participate(sessionId, userId);
		// Check 
        assertTrue(session.getUsers().contains(user));
        verify(sessionRepo).save(session);
    }

    @Test
    public void testUnparticipateSession_ShouldSucceed() {
		// Data
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = Session.builder()
                .id(sessionId)
                .name("Test Session")
                .date(new Date())
                .description("Test session description")
                .users(new ArrayList<>(Collections.singletonList(user)))
                .build();
		// Mock 
        when(sessionRepo.findById(sessionId)).thenReturn(Optional.of(session));
        when(sessionRepo.save(session)).thenReturn(session);
		// Action
        sessionSrvc.noLongerParticipate(sessionId, userId);
		// Check
        assertFalse(session.getUsers().contains(user));
        verify(sessionRepo).save(session);
    }

}
