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
  host: '127.0.0.1',
  port: 6379,
  db: 0,
};
