-- Your SQL goes here
CREATE TABLE users (
  id SERIAL NOT NULL,
  user_id TEXT NOT NULL PRIMARY KEY,
  verses TEXT [] NOT NULL,
  created_at TIMESTAMP NOT NULL
);
