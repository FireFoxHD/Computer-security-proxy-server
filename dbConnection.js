// https://github.com/mysqljs/mysql

import { createConnection } from 'mysql';
import 'dotenv/config';

const connection = createConnection({
  host: process.env.DB_HOST, // Host name
  user: process.env.DB_USER, // Username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME // Database Name
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Database is connected successfully ! --- Connection ID: ${connection.threadId}`);
});

export { connection as default };
// TODO: CONSIDER POOLING CONNECTIONS FOR EFFICENCY
