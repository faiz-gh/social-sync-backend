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
      media character varying NOT NULL,
      location character varying NOT NULL,
      description character varying NOT NULL,
      accountID uuid NOT NULL,
      postSchedule timestamp NOT NULL DEFAULT now(),
      createdDate timestamp NOT NULL DEFAULT now(),
      lastModified timestamp NOT NULL DEFAULT now(),
      isDeleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE posts ADD CONSTRAINT post_account_fk FOREIGN KEY (accountID) REFERENCES accounts (id);
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
