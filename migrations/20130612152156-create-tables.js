var async = require('async');
var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.createTable.bind(db, 'users', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      userid: 'string',
      nickname: 'string',
      password: 'string',
      created_at: 'datetime',
      updated_at: 'datetime',
    }),

    db.createTable.bind(db, 'boards', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      name: 'string'
      created_at: 'datetime',
      updated_at: 'datetime',
    });

    db.createTable.bind(db, 'tags', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      user_id: 'int',
      board_id: 'int',
      message: 'string',
      color: 'string',
      background_color: 'string',
      position_x: 'int',
      position_y: 'int',
      size_x: 'int',
      size_y:'int',
      created_at: 'datetime',
      updated_at: 'datetime',
    });

    db.createTable.bind(db, 'messages', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      message: 'string',
      created_at: 'datetime',
      updated_at: 'datetime',
    });

  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.dropTable.bind(db, 'users'),
    db.dropTable.bind(db, 'boards')
    db.dropTable.bind(db, 'tags')
    db.dropTable.bind(db, 'messages')
  ], callback);
};
