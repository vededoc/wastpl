drop table if exists user_profile;
create table user_profile (
    uid int unsigned auto_increment,
    email varchar(50),
    serviceId varchar(20),
    password varchar(20),
    userId varchar(50),
    userName varchar(50),
    authType varchar(20),

    phoneNumber varchar(20),
    address varchar(256),
    status char,
    signupDate datetime,
    imgUrl varchar(256),
    constraint user_profile_pk primary key (uid)
);
create unique index user_profile_idx_email on user_profile(email);
create index user_profile_idx_serviceId on user_profile(serviceId);

-- user status
create table user_status (
    uid int unsigned,
    signInTime datetime,
    status int,
    constraint user_status_fk
        foreign key (uid) references user_profile (uid)
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
    privKey varchar(2048),
    publicKey varchar(2048),
    constraint service_profile_pk primary key (serviceId)
);
create index service_profile_idx on service_profile(apiKey);