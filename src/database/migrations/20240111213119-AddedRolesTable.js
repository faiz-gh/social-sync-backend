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
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS roles (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      roleName character varying NOT NULL,
      description character varying NOT NULL,
      createdDate timestamp NOT NULL DEFAULT now(),
      lastModified timestamp NOT NULL DEFAULT now(),
      isDeleted boolean NOT NULL DEFAULT false
    );
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS roles;
  `);
};

exports._meta = {
  "version": 1
};
