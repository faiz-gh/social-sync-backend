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
    CREATE TABLE IF NOT EXISTS accounts (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      clientID uuid NOT NULL,
      username character varying NOT NULL,
      password character varying NOT NULL,
      apiKey character varying NOT NULL,
      createdDate timestamp NOT NULL DEFAULT now(),
      lastModified timestamp NOT NULL DEFAULT now(),
      isDeleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE accounts ADD CONSTRAINT account_client_fk FOREIGN KEY (clientID) REFERENCES clients (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE accounts DROP CONSTRAINT account_client_fk;
    DROP TABLE IF EXISTS accounts;
  `);
};

exports._meta = {
  "version": 1
};
