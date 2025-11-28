package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.repository.SessionRepository;

import static com.openclassrooms.starterjwt.utils.AttributeIgnoringComparator.ignoreAttrs;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "test1@test.com", password = "test!1234")
@Transactional
@ActiveProfiles("test")
class SessionControllerTest {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private SessionRepository sessionRepo;

	final SessionDto expectedSession = SessionDto
			.builder()
			.id(1L)
			.name("Test session")
			.teacher_id(1L)
			.description("a test session")
			.users(new ArrayList<>())
			.build();

	final SessionDto createSessionRequest = SessionDto.builder()
			.name("Test Session create")
			.date(java.sql.Timestamp.valueOf(LocalDateTime.now()))
			.teacher_id(2L)
			.description("Test session creation")
			.build();

	@Test
	void getSessionById_ShouldSucceed() throws Exception {
		mockMvc.perform(get("/api/session/1"))
				.andExpectAll(status().isOk(),
						content().json(objectMapper.writeValueAsString(expectedSession),
								ignoreAttrs("date", "createdAt", "updatedAt")));
	}

	@Test
	void getAllSession_ShouldSucceed() throws Exception {
		mockMvc.perform(get("/api/session"))
				.andExpectAll(status().isOk(),
						content().json(objectMapper.writeValueAsString(Arrays.asList(expectedSession)),
								ignoreAttrs("date", "createdAt", "updatedAt")));
	}

	@Test
	void getSessionById_ShouldFail() throws Exception {
		mockMvc.perform(get("/api/session/2"))
				.andExpect(status().isNotFound());

		mockMvc.perform(get("/api/session/a"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createSessionById_andModify_ShouldSucceed() throws Exception {
		mockMvc.perform(post("/api/session")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createSessionRequest)))
				.andExpect(status().isOk());
		assert (sessionRepo.findById(2L).isPresent());

		SessionDto modifiedSession = createSessionRequest;
		modifiedSession.setName("Modified session name");
		mockMvc.perform(put("/api/session/2")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(modifiedSession)))
				.andExpectAll(status().isOk(),
						content().json(objectMapper.writeValueAsString(modifiedSession),
								ignoreAttrs("id", "users", "createdAt", "updatedAt")));
	}

	@Test 
	void updateSessionById_ShouldFail() throws Exception {
		mockMvc.perform(put("/api/session/a")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createSessionRequest)))
			.andExpect(status().isBadRequest());
	}

	@Test 
	void deleteSessionById_ShouldSucceed() throws Exception {
		mockMvc.perform(delete("/api/session/1"))
			.andExpect(status().isOk());
		assert (sessionRepo.findById(1L).isEmpty());
	}

	@Test 
	void deleteSessionById_ShouldFail() throws Exception {
		mockMvc.perform(delete("/api/session/99"))
			.andExpect(status().isNotFound());

		mockMvc.perform(delete("/api/session/a"))
			.andExpect(status().isBadRequest());
	}

	@Test
	void participateAndUnparticipate_ShouldSucceed() throws Exception {
		mockMvc.perform(post("/api/session/1/participate/2"))
				.andExpectAll(status().isOk());

		// Assert the participation is registered in the session.
		assert(sessionRepo.findById(1L).filter(s -> s.getUsers().stream().anyMatch(u -> u.getId() == 2L)).isPresent());

		mockMvc.perform(delete("/api/session/1/participate/2"))
				.andExpectAll(status().isOk());

	}

	@Test
	void participateTwice_ShouldFail() throws Exception {
		mockMvc.perform(post("/api/session/1/participate/2"))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/session/1/participate/2"))
				.andExpect(status().isBadRequest());

	}

	@Test
	void participateAndUnparticipateWithInvalidIds_ShouldFail() throws Exception {
		mockMvc.perform(post("/api/session/a/participate/2"))
				.andExpect(status().isBadRequest());

		mockMvc.perform(post("/api/session/1/participate/a"))
				.andExpect(status().isBadRequest());

		mockMvc.perform(post("/api/session/a/participate/2"))
				.andExpect(status().isBadRequest());

		mockMvc.perform(delete("/api/session/1/participate/a"))
				.andExpect(status().isBadRequest());

		mockMvc.perform(post("/api/session/1/participate/999"))
				.andExpect(status().isNotFound());

		mockMvc.perform(post("/api/session/9999/participate/2"))
				.andExpect(status().isNotFound());

		mockMvc.perform(delete("/api/session/9999/participate/2"))
				.andExpect(status().isNotFound());

		mockMvc.perform(delete("/api/session/1/participate/999"))
				.andExpect(status().isBadRequest());
	}

}
