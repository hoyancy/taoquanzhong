// CRUD SQL语句
var user = {
    insert: 'insert into user(account, password, referrer) values(?,?,?)',
    update: 'update user set account=?, password=?',
    delete: 'delete from user where account=?',
    queryByAccount: 'select * from user where account=?',
    queryAll: 'select * from user',
    recommendNumOfPeople: 'select count(*) as recommendNum from user where referrer = (select id from user where account = ?);'
};

module.exports = user;