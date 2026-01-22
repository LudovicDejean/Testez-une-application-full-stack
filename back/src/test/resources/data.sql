INSERT INTO USERS (last_name, first_name, admin, email, password)
VALUES 
	('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
	('Test1', 'Test1', false, 'test1@test.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'), 
	('Test2', 'Test2', false, 'test2@test.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'); 


INSERT INTO TEACHERS (first_name, last_name)
VALUES ('Margot', 'DELAHAYE'),
       ('Hélène', 'THIERCELIN');

INSERT INTO SESSIONS (name, description, date, teacher_id)
VALUES ('Test session', 'a test session', CURRENT_TIMESTAMP, 1);
