\echo 'Delete and recreate autolog db?'
\prompt 'Return for yes or control-C to cancel > ' answer
DROP DATABASE autolog;
CREATE DATABASE autolog;
\connect autolog;

\i autolog-schema.sql