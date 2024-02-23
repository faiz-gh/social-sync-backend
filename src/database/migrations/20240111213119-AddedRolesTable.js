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
      id serial PRIMARY KEY,
      role_name character varying NOT NULL,
      description character varying NOT NULL,
      created_date timestamp NOT NULL DEFAULT now(),
      last_modified timestamp NOT NULL DEFAULT now(),
      is_deleted boolean NOT NULL DEFAULT false
    );
    
    INSERT INTO roles (role_name, description) VALUES ('ADMIN', 'Admin Account');
    INSERT INTO roles (role_name, description) VALUES ('COMPANY', 'Company Account');
    INSERT INTO roles (role_name, description) VALUES ('EMPLOYEE', 'Employee Account');
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
