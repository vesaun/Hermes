CREATE TABLE google_auth (
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE account_information (
    email VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    hometown_state VARCHAR(255),
    hometown_city VARCHAR(255),
    gpa DECIMAL(3, 2),
    instagram_username VARCHAR(255),
    major VARCHAR(255),
    active BOOLEAN,
    fraternity VARCHAR(255),
    FOREIGN KEY (email) REFERENCES google_auth(email)
);

CREATE TABLE fraternity (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    chapter VARCHAR(255) NOT NULL,
    member_count INT,
    address VARCHAR(255),
    year_founded INT
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    fraternity_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(255),
    FOREIGN KEY (fraternity_id) REFERENCES fraternity(id)
);