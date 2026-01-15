require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectToDatabase = require('./db');
const userRoute = require('./routes/userRoute');
const canvasRoutes = require('./routes/canvasRoute');
const Canvas = require('./models/canvasModel'); 

const app = express();
connectToDatabase();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/users', userRoute);
app.use('/canvas', canvasRoutes);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-canvas', async (canvasId) => {
    try {
      console.log(`Join request for canvas ${canvasId}`);

      socket.join(canvasId);

      const canvas = await Canvas.findById(canvasId);

      if (!canvas) {
        socket.emit('error', { message: 'Canvas not found' });
        return;
      }

      socket.emit('load-canvas', {
        canvasId,
        data: canvas.data,
        name: canvas.name,
        updatedAt: canvas.updatedAt,
      });

      console.log(`Canvas ${canvasId} loaded and sent`);
    } catch (err) {
      console.error('Join canvas error:', err);
      socket.emit('error', { message: 'Failed to load canvas' });
    }
  });

  socket.on('canvas-update', async ({ canvasId, data }) => {
    try {
      socket.to(canvasId).emit('canvas-update', data);

      await Canvas.findByIdAndUpdate(canvasId, {
        data,
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error('Canvas update error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
const PORT = 3030;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
