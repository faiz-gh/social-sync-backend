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
      client_id uuid NOT NULL,
      facebook_user_id character varying NOT NULL,
      page_id character varying NOT NULL,
      page_name character varying NOT NULL,
      page_access_token character varying NOT NULL,
      user_access_token character varying NOT NULL,
      created_date timestamp NOT NULL DEFAULT now(),
      last_modified timestamp NOT NULL DEFAULT now(),
      is_deleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE accounts ADD CONSTRAINT account_client_fk FOREIGN KEY (client_id) REFERENCES clients (id);
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
