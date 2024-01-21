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
    CREATE TABLE IF NOT EXISTS tasks (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title character varying NOT NULL,
      description character varying NOT NULL,
      user_id uuid NOT NULL,
      created_date timestamp NOT NULL DEFAULT now(),
      last_modified timestamp NOT NULL DEFAULT now(),
      estimated_time timestamp NOT NULL DEFAULT now(),
      time_taken timestamp NOT NULL DEFAULT now(),
      is_completed boolean NOT NULL DEFAULT false,
      is_deleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE tasks ADD CONSTRAINT task_user_fk FOREIGN KEY (user_id) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE tasks DROP CONSTRAINT task_user_fk;
    DROP TABLE IF EXISTS tasks;
  `);
};

exports._meta = {
  "version": 1
};
