// Imports
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

// App Imports
import { hub, hubMiddleware } from './sseHub';

// Load express modules
export default function (server) {
  console.info('SETUP - Loading modules...');

  // Enable CORS
  server.use(cors());
  server.set('views', path.join(__dirname, '../public/views'));
  server.set('view engine', 'ejs');

  // Request body parser
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Request body cookie parser
  server.use(cookieParser());

  // HTTP logger
  if (process.env.NODE_ENV !== 'test') server.use(morgan('tiny'));
}
