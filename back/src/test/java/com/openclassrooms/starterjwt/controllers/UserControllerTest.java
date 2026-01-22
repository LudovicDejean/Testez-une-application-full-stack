package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.repository.UserRepository;

import static com.openclassrooms.starterjwt.utils.AttributeIgnoringComparator.ignoreAttrs;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "test1@test.com", password = "test!1234")
@Transactional
@ActiveProfiles("test")
class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	UserDto expectedUser1 = new UserDto(2L, "test1@test.com", "Test1", "Test1", false, null, null, null);
	UserDto expectedUser2 = new UserDto(3L, "test2@test.com", "Test2", "Test2", false, null, null, null);

	@Test
	void getUserByIdShouldSucceed() throws Exception {
		mockMvc.perform(get("/api/user/2"))
				.andExpectAll(
						status().isOk(),
						content().json(objectMapper.writeValueAsString(expectedUser1),
								ignoreAttrs("createdAt", "updatedAt")));

		mockMvc.perform(get("/api/user/3"))
				.andExpectAll(
						status().isOk(),
						content().json(objectMapper.writeValueAsString(expectedUser2),
								ignoreAttrs("createdAt", "updatedAt")));
	}

	@Test
	void getUserByIdShouldFail() throws Exception {
		mockMvc.perform(get("/api/user/99"))
				.andExpect(status().isNotFound());
	}

	@Test
	void getUserByInvalidIdShouldFail() throws Exception {
		mockMvc.perform(get("/api/user/a"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void deleteUserById_ShouldSucceed() throws Exception {
		mockMvc.perform(delete("/api/user/2"))
				.andExpect(status().isOk());
		assert (userRepository.findById(2L).isEmpty());
	}

	@Test
	void deleteOtherUserById_ShouldFail() throws Exception {
		mockMvc.perform(delete("/api/user/3"))
				.andExpect(status().isUnauthorized());
		assert (userRepository.findById(3L).isPresent());

		mockMvc.perform(delete("/api/user/99"))
				.andExpect(status().isNotFound());

		mockMvc.perform(delete("/api/user/abc"))
				.andExpect(status().isBadRequest());
	}
}
