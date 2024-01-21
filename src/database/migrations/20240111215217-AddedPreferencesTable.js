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
    CREATE TABLE IF NOT EXISTS preferences (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id uuid NOT NULL,
      theme character varying NOT NULL,
      layout character varying NOT NULL,
      last_modified timestamp NOT NULL DEFAULT now()
    );

    ALTER TABLE preferences ADD CONSTRAINT preferences_user_fk FOREIGN KEY (user_id) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE preferences DROP CONSTRAINT preferences_user_fk;
    DROP TABLE IF EXISTS preferences;
  `);
};

exports._meta = {
  "version": 1
};
