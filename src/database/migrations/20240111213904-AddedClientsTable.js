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
    CREATE TABLE IF NOT EXISTS clients (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      userID uuid NOT NULL,
      name character varying NOT NULL,
      createdDate timestamp NOT NULL DEFAULT now(),
      lastModified timestamp NOT NULL DEFAULT now(),
      isDeleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE clients ADD CONSTRAINT client_user_fk FOREIGN KEY (userID) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS client_user_fk;
    DROP TABLE IF EXISTS clients;
  `);
};

exports._meta = {
  "version": 1
};
