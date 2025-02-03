import http from 'http';
import app from './config/app.js';

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});