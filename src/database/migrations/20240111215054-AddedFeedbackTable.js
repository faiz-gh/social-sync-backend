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
    CREATE TABLE IF NOT EXISTS feedback (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      subject character varying NOT NULL,
      description character varying NOT NULL,
      userID uuid NOT NULL,
      createdDate timestamp NOT NULL DEFAULT now(),
      isOpened boolean NOT NULL DEFAULT false,
      isDeleted boolean NOT NULL DEFAULT false
    );
    ALTER TABLE feedback ADD CONSTRAINT feedback_user_fk FOREIGN KEY (userID) REFERENCES users (id);
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE feedback DROP CONSTRAINT feedback_user_fk;
    DROP TABLE IF EXISTS feedback;
  `);
};

exports._meta = {
  "version": 1
};
