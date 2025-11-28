package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.TeacherDto;

import static com.openclassrooms.starterjwt.utils.AttributeIgnoringComparator.ignoreAttrs;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "test1@test.com", password = "test!1234")
@Transactional
@ActiveProfiles("test")
class TeacherControllerTest {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	TeacherDto expectedTeacher1 = new TeacherDto(1L, "DELAHAYE", "Margot", null, null);
	TeacherDto expectedTeacher2 = new TeacherDto(2L, "THIERCELIN", "Hélène", null, null);

	@Test
	void findAll() throws Exception {
		mockMvc.perform(get("/api/teacher"))
				.andExpectAll(
						status().isOk(),
						content().json(
								objectMapper.writeValueAsString(Arrays.asList(expectedTeacher1, expectedTeacher2)),
								ignoreAttrs("createdAt", "updatedAt")));
	}

	@Test
	void findByIdShouldSucceed() throws Exception {
		mockMvc.perform(get("/api/teacher/1"))
				.andExpectAll(
						status().isOk(),
						content().json(
								objectMapper.writeValueAsString(expectedTeacher1),
								ignoreAttrs("createdAt", "updatedAt")));

		mockMvc.perform(get("/api/teacher/2"))
				.andExpectAll(
						status().isOk(),
						content().json(
								objectMapper.writeValueAsString(expectedTeacher2),
								ignoreAttrs("createdAt", "updatedAt")));
	}

	@Test
	void findByIdShouldFail() throws Exception {
		mockMvc.perform(get("/api/teacher/99"))
				.andExpect(status().isNotFound());
	}

	@Test
	void findByInvalidIdShouldFail() throws Exception {
		mockMvc.perform(get("/api/teacher/abc"))
				.andExpect(status().isBadRequest());
	}
}
