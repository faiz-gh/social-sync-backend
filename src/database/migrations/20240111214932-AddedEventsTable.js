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
      title character varying NOT NULL,
      reminder timestamp NOT NULL DEFAULT now(),
      scheduledAt timestamp NOT NULL DEFAULT now(),
      userID uuid NOT NULL,
      dateCreated timestamp NOT NULL DEFAULT now(),
      lastModified timestamp NOT NULL DEFAULT now(),
      isDeleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE events ADD CONSTRAINT event_user_fk FOREIGN KEY (userID) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE events DROP CONSTRAINT event_user_fk;
    DROP TABLE IF EXISTS events;
  `);
};

exports._meta = {
  "version": 1
};
