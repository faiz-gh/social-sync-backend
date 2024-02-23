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
    CREATE TABLE IF NOT EXISTS events (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_id uuid NOT NULL,
      title character varying NOT NULL,
      description character varying,
      location character varying,
      start_date timestamp NOT NULL,
      end_date timestamp NOT NULL,
      created_date timestamp NOT NULL DEFAULT now(),
      last_modified timestamp NOT NULL DEFAULT now(),
      is_deleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE events ADD CONSTRAINT event_company_fk FOREIGN KEY (company_id) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE events DROP CONSTRAINT event_company_fk;
    DROP TABLE IF EXISTS events;
  `);
};

exports._meta = {
  "version": 1
};
