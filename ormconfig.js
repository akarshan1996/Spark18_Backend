if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
module.exports =
{
  type: `${process.env.type || mysql}`,
  host: `${process.env.host || localhost}`,
  port: `${process.env.port || 5432}`,
  username: `${process.env.username || localhost}`,
  password: `${process.env.password}`,
  database: `${process.env.database || test}`,
  entities: ["src/entity/**/*.ts"],
  synchronize: true,
  autoSchemaSync: true,
  logging: true,
};
