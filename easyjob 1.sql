create database easyjob
use easyjob

create table Users
(
	UserID tinyint not null IDENTITY(1,1),
	email varchar(50) not null, 
	username varchar(20) not null,
	password varchar(80) not null,
	type char(3) not null,
);

CREATE TABLE IF NOT EXISTS Talent(
  Tal_ID TINYINT not null AUTO_INCREMENT,
  Tal_CnName varchar(50),
  Tal_EngName varchar(50) not null,
  Tal_DOB DATE not null,
  Tal_Age tinyint not null,
  Tal_Gender varchar(10) not null,
  Tal_MobileNum varchar(15) not null,
  Tal_HomeNum varchar(15),
  Tal_Email varchar(50),
  Tal_Address varchar(50),
  Tal_Premium char(1) not null,
  Tal_GradSchool varchar(50),
  Tal_GradLvl varchar(15),
  Tal_GradGrade decimal,
  Tal_GradDate date,
  UserID int,
  constraint PK_Tal_ID PRIMARY KEY(Tal_ID),
  constraint FK_UserID FOREIGN KEY(UserID) references Users(UserID)
)

create table Advisor
(
	Adv_ID tinyint not null IDENTITY(1,1),
	Adv_CnName varchar(50),
	Adv_EngName varchar(50) not null,
	Adv_DOB date not null,
	Adv_Age tinyint not null,
	Adv_Gender varchar(10) not null,
	Adv_MobileNum varchar(15) not null,
	Adv_HomeNum varchar(15),
	Adv_Email varchar(50),
	Adv_Address varchar(50),
	Adv_Premium char(1),
	UserID char(4) not null,
)

create table Experience
(
	Exp_ID tinyint not null IDENTITY(1,1),
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

