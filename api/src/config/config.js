//
// The configuration options of the server
//

export const general = {
  graphqlEndpoint: '/graphql',
  port: 8000,
  graphql: {
    ide: true,
    pretty: true,
  },
};

export const limitSettings = {
  invoice: {
    get: 100,
  },
  city: {
    get: 100,
  },
};
export const configRedis = {
  host: process.env.REDIS_HOST ? process.env.REDIS_HOST : '127.0.0.1',
  port: process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379,
  db: 0,
};
