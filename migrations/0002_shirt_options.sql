-- Migration 0002: per-shirt customization options.
-- A shirt offers a set of colors and a set of recovery programs. Both are
-- many-to-many with shirts, so each lives in its own table plus a join table.
CREATE TABLE colors (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  hex  TEXT NOT NULL          -- swatch color, e.g. '#166534'
);

CREATE TABLE programs (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,  -- 'aa', 'na', 'anger-management'
  name TEXT NOT NULL          -- human label, e.g. 'Alcoholics Anonymous'
);

CREATE TABLE shirt_colors (
  shirt_id INTEGER NOT NULL REFERENCES shirts(id),
  color_id INTEGER NOT NULL REFERENCES colors(id),
  PRIMARY KEY (shirt_id, color_id)
);

CREATE TABLE shirt_programs (
  shirt_id   INTEGER NOT NULL REFERENCES shirts(id),
  program_id INTEGER NOT NULL REFERENCES programs(id),
  PRIMARY KEY (shirt_id, program_id)
);
