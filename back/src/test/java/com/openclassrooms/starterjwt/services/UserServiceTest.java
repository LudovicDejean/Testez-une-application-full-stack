package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private UserService userSrvc;

    @Test
    public void testGetUserById_ShouldReturnUser() {
        // Data
        Long userId = 1L;
        User userExpected = new User();
        userExpected.setId(userId);
        // Mock
        when(userRepo.findById(userId)).thenReturn(Optional.of(userExpected));
        // Action
        User userActual = userSrvc.findById(userId);
        // Check
        assertNotNull(userActual);
        assertEquals(userExpected, userActual);
        verify(userRepo).findById(userId);
    }

    @Test
    public void testGetUserByInvalidId_ShouldReturnNull() {
        // Data
        Long userId = 999L;
        // Mock
        when(userRepo.findById(userId)).thenReturn(Optional.empty());
        // Action
        User userActual = userSrvc.findById(userId);
        // Check
        assertNull(userActual);
        verify(userRepo).findById(userId);
    }

    @Test
    public void testDeleteUserById_ShouldDeleteUser() {
        // Data
        Long userId = 1L;
        // Action
        userSrvc.delete(userId);
        // Check
        verify(userRepo).deleteById(userId);
    }

    @Test
    public void testDeleteUserByInvalidId_ShouldNotThrowException() {
        // Data
        Long userId = 999L;
        // Action
        userSrvc.delete(userId);
        // Check
        verify(userRepo).deleteById(userId);
    }
}
