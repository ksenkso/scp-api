create database scp character set utf8 collate utf8_general_ci;
use scp;
create table objects (
    id int primary key auto_increment,
    name varchar(255),
    number varchar(8),
    link varchar(255),
    class varchar(10)
);
create table stats (
    value int,
    name varchar(20)
);
