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
    ALTER TABLE posts
      ADD COLUMN page_post_id character varying DEFAULT NULL;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE posts
      DROP COLUMN page_post_id;
  `);
};

exports._meta = {
  "version": 1
};
