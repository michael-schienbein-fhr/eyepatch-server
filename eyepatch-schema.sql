CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  room_owner VARCHAR(25) NOT NULL
    REFERENCES users,
  room_name VARCHAR(30) NOT NULL,
  password TEXT,
  has_pass BOOLEAN NOT NULL,
  room_members VARCHAR(25),
  video_queue VARCHAR(25),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
  youtubeid VARCHAR(25) PRIMARY KEY 
);
