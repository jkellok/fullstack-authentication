CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password, role)
VALUES
    ('recruiter@example.com', 'recruiterpassword', 'recruiter'),
    ('student@example.com', 'studentpassword', 'student'),
    ('admin@example.com', 'adminpassword', 'admin');
