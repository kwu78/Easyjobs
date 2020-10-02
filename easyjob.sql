
CREATE DATABASE IF NOT EXISTS Easyjobs DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE Easyjobs;


CREATE TABLE IF NOT EXISTS Users
(
	UserID int NOT NULL AUTO_INCREMENT,
	username varchar(20) NOT NULL,
	password varchar(30) NOT NULL,
	email varchar(50) NOT NULL,
	type char(3) NOT NULL,
	PRIMARY KEY(UserID)
);

create table Talent
(
	Tal_ID varchar(10) not null,
	Tal_CnName varchar(50),
	Tal_EngName varchar(50) not null,
	Tal_DOB date not null,
	Tal_Age tinyint not null,
	Tal_Gender varchar(10) not null,
	Tal_MobileNum varchar(15) not null,
	Tal_HomeNum varchar(15),
	Tal_Email varchar(50),
	Tal_Address varchar(50) not null,
	Tal_Premium char(1) not null,
	Tal_GradSchool varchar(50),
	Tal_GradLvl varchar(15),
	Tal_GradGrade decimal,
	Tal_GradDate date,
	UserID int not null,
)

create table Advisor
(
	Adv_ID varchar(10) not null,
	Adv_CnName varchar(50),
	Adv_EngName varchar(50) not null,
	Adv_DOB date not null,
	Adv_Age tinyint not null,
	Adv_Gender varchar(10) not null,
	Adv_MobileNum varchar(15) not null,
	Adv_HomeNum varchar(15),
	Adv_Email varchar(50),
	Adv_Address varchar(50) not null,
	Adv_Premium char(1) not null,
	UserID char(4) not null,
)

create table Experience
(
	Exp_ID varchar(10) not null,
	Exp_position varchar(20),
	Exp_duration tinyint,
	Exp_CompanyName varchar(50),
	Tal_ID varchar(10) not null,
)

alter table Users
add constraint PK_UserID primary key(UserID);

alter table Talent
add constraint PK_Tal_ID primary key(Tal_ID),
constraint FK_UserID foreign key(UserID) references Users(UserID);

alter table Advisor
add constraint PK_Adv_ID primary key(Adv_ID),
constraint FK_UserID2 foreign key(UserID) references Users(UserID);

alter table Experience
add constraint PK_Exp_ID primary key(Exp_ID),
constraint FK_Tal_ID foreign key(Tal_ID) references Talent(Tal_ID);