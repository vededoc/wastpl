drop table if exists user_profile;
create table user_profile (
    rid int unsigned auto_increment,
    userId varchar(50),
    password varchar(20),
    userName varchar(50),

    phoneNumber varchar(20),
    address varchar(256),
    status char,
    signupDate datetime,
    constraint user_profile_pk primary key (rid, userId)
);