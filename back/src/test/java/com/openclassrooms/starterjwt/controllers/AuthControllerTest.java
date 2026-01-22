package com.openclassrooms.starterjwt.controllers;

import static com.openclassrooms.starterjwt.utils.AttributeIgnoringComparator.ignoreAttrs;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.transaction.Transactional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;


@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private ObjectMapper objectMapper;

	// UserDto expectedUser1 = new UserDto(2L, "test1@test.com", "Test1", "Test1", false, null, null, null);
	JwtResponse expectedLoginResponse = new JwtResponse(null, null, "test1@test.com", "Test1", "Test1", false);


	@Test
	void loginUserShouldSucceed() throws Exception {
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail("test1@test.com");
		loginRequest.setPassword("test!1234");

		mockMvc.perform(
				post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpectAll(
						status().isOk(),
						content().json(objectMapper.writeValueAsString(expectedLoginResponse), ignoreAttrs("token", "id")));

	}

	@Test
	void loginAdminShouldSucceed() throws Exception {
		LoginRequest adminLoginRequest = new LoginRequest();
		adminLoginRequest.setEmail("yoga@studio.com");
		adminLoginRequest.setPassword("test!1234");
		mockMvc.perform(
				post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adminLoginRequest)))
				.andExpectAll(
						status().isOk(),
						jsonPath("$.admin").value(true));
	}

	@Test
	void loginUserShouldFail() throws Exception {
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setEmail("test1@test.com");
		loginRequest.setPassword("wrongpassword");


		mockMvc.perform(
				post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isUnauthorized());
	}


	@Test
	void registerWithSameEmailShouldFail() throws Exception {
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmail("test1@test.com");
		signupRequest.setFirstName("Test");
		signupRequest.setLastName("Test");
		signupRequest.setPassword("test1234");

		mockMvc.perform(
				post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(signupRequest)))
				.andExpectAll(
						status().isBadRequest(),
						jsonPath("$.message").value("Error: Email is already taken!"));
	}

	@Test
	void registerRequestShouldSuccess() throws Exception {
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmail("test3@test.com");
		signupRequest.setFirstName("Test3");
		signupRequest.setLastName("Test3");
		signupRequest.setPassword("test1234");

		mockMvc.perform(
				post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(signupRequest)))
				.andExpectAll(
						status().isOk(),
						jsonPath("$.message").value("User registered successfully!"));

		assert (userRepo.existsByEmail("test2@test.com"));
	}
}
