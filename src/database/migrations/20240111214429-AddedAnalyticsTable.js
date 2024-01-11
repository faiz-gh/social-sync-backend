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
    CREATE TABLE IF NOT EXISTS analytics (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      postID uuid NOT NULL,
      data json NOT NULL,
      createdDate timestamp NOT NULL DEFAULT now()
    );
    ALTER TABLE analytics ADD CONSTRAINT analytics_post_fk FOREIGN KEY (postID) REFERENCES posts (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE analytics DROP CONSTRAINT analytics_post_fk;
    DROP TABLE IF EXISTS analytics;
  `);
};

exports._meta = {
  "version": 1
};
