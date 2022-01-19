export default {
  mysql: {
    database: 'db_test',
    username: 'root',
    password: '****',
  },
  redis: {
    port: 6379,
    host: "127.0.0.1",
    prefix: "sam:", //存诸前缀
    // ttl: 60 * 60 * 23,  //过期时间
    family: 4, // 4 (IPv4) or 6 (IPv6)
    db: 0
  },
  httpserver: {
    host: "localhost",
    port: 3000,
  },
}
