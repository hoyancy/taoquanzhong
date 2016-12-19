// CRUD SQL语句
var user = {
    insert: 'insert into user(account, password) values(?,?)',
    update: 'update user set account=?, password=?',
    delete: 'delete from user where account=?',
    queryByAccount: 'select * from user where account=?',
    queryAll: 'select * from user'
};

module.exports = user;