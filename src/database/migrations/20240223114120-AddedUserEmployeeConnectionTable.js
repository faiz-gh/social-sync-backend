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
    CREATE TABLE company_employee_connection (
      id serial PRIMARY KEY,
      company_id uuid NOT NULL,
      employee_id uuid NOT NULL
    );
    ALTER TABLE company_employee_connection ADD CONSTRAINT user_company_connection_fk FOREIGN KEY (company_id) REFERENCES users (id);
    ALTER TABLE company_employee_connection ADD CONSTRAINT user_employee_connection_fk FOREIGN KEY (employee_id) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE company_employee_connection DROP CONSTRAINT IF EXISTS user_company_connection_fk;
    ALTER TABLE company_employee_connection DROP CONSTRAINT IF EXISTS user_employee_connection_fk;
    DROP TABLE company_employee_connection;
  `);
};

exports._meta = {
  "version": 1
};
