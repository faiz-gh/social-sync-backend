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
    CREATE TABLE IF NOT EXISTS posts (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      account_id uuid NOT NULL,
      image_url character varying,
      location character varying,
      description character varying NOT NULL,
      tags character varying[],
      post_schedule timestamp NOT NULL DEFAULT now(),
      created_date timestamp NOT NULL DEFAULT now(),
      last_modified timestamp NOT NULL DEFAULT now(),
      is_deleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE posts ADD CONSTRAINT post_account_fk FOREIGN KEY (account_id) REFERENCES accounts (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE posts DROP CONSTRAINT post_account_fk;
    DROP TABLE IF EXISTS posts;
  `);
};

exports._meta = {
  "version": 1
};
