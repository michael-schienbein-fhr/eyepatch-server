\echo 'Delete and recreate eyepatch db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS eyepatch;
CREATE DATABASE eyepatch;
\c eyepatch

\i eyepatch-schema.sql
\i eyepatch-seed.sql

\echo 'Delete and recreate eyepatch_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS eyepatch_test;
CREATE DATABASE eyepatch_test;
\c eyepatch_test

\i eyepatch-schema.sql
