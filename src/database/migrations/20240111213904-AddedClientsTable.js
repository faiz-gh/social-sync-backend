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
      company_id uuid NOT NULL,
      employee_id uuid NOT NULL,
      name character varying NOT NULL,
      email character varying UNIQUE NOT NULL,
      created_date timestamp NOT NULL DEFAULT now(),
      last_modified timestamp NOT NULL DEFAULT now(),
      is_deleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE clients ADD CONSTRAINT client_company_fk FOREIGN KEY (company_id) REFERENCES users (id);
    ALTER TABLE clients ADD CONSTRAINT client_employee_fk FOREIGN KEY (employee_id) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS client_company_fk;
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS client_employee_fk;
    DROP TABLE IF EXISTS clients;
  `);
};

exports._meta = {
  "version": 1
};
