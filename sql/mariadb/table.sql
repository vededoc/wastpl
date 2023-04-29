drop table if exists user_profile;
create table user_profile (
    serviceId varchar(20),
    userId varchar(50),
    password varchar(20),
    userName varchar(50),

    phoneNumber varchar(20),
    address varchar(256),
    status char,
    signupDate datetime,
    imgUrl varchar(256),
    constraint user_profile_pk primary key (userId, serviceId)
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

drop table if exists service_profile;
create table service_profile (
    serviceId varchar(10),
    apiKey varchar(40),
    status int,
    registeredDate datetime,
    updateDate datetime,
    polices json,
    description varchar(128),
    constraint service_profile_pk primary key (serviceId)
);
create index service_profile_idx on service_profile(apiKey);