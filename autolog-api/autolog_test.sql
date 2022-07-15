\echo 'Delete and recreate autolog_test db?'
\prompt 'Return for yes or control-C to cancel > ' answer
DROP DATABASE autolog_test;
CREATE DATABASE autolog_test;
\connect autolog_test;

\i autolog-schema.sql