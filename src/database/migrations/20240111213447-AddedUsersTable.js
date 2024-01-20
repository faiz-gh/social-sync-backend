'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      role_id integer NOT NULL,
      aws_user_id uuid NOT NULL,
      full_name character varying NOT NULL,
      email character varying NOT NULL,
      password character varying NOT NULL,
      is_email_validated boolean NOT NULL DEFAULT false,
      is_activated boolean NOT NULL DEFAULT false,
      created_date timestamp NOT NULL DEFAULT now(),
      last_modified timestamp NOT NULL DEFAULT now(),
      is_deleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE users ADD CONSTRAINT user_role_fk FOREIGN KEY (role_id) REFERENCES roles (id);
    CREATE INDEX users_email_idx ON users (email);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP INDEX IF EXISTS users_email_idx;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS user_role_fk;
    DROP TABLE IF EXISTS users;
  `);
};

exports._meta = {
  "version": 1
};
