CREATE KEYSPACE tests WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 3};
USE tests;

DROP TABLE IF EXISTS sessions;

CREATE TABLE IF NOT EXISTS sessions (
   sid text,
   session text,
   expires timestamp,
   PRIMARY KEY(sid)
);
