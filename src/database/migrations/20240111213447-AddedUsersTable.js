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
      roleID uuid NOT NULL,
      firstname character varying NOT NULL,
      lastname character varying NOT NULL,
      email character varying NOT NULL,
      password character varying NOT NULL,
      isEmailValidated boolean NOT NULL DEFAULT false,
      isActivated boolean NOT NULL DEFAULT false,
      createdDate timestamp NOT NULL DEFAULT now(),
      lastModified timestamp NOT NULL DEFAULT now(),
      isDeleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE users ADD CONSTRAINT user_role_fk FOREIGN KEY (roleID) REFERENCES roles (id);
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
