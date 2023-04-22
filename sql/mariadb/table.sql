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

drop table if exists api_log;
create table api_log (
  rid bigint auto_increment,
  ctime datetime,
  serviceId varchar(10),
  urlPath varchar(256),
  data varchar(1024),
  constraint api_log_pk primary key (rid)
);
create index api_log_idx ON api_log(ctime, serviceId);