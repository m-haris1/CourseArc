// Core modules
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

// Third-party modules
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { Server: SocketIO } = require('socket.io');
const dotenv = require('dotenv');

// Project modules
const database = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const courseRoutes = require('./routes/Course');
const paymentRoutes = require('./routes/Payments');
const contactUsRoute = require('./routes/Contact');
const ACTIONS = require('./utils/Actions');

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: {
    origin: "*",  // Adjust to your frontend URL or restrict as needed
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:4000/api/v1", // Adjust origin as needed
  credentials: true,
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// Connect to database and cloudinary
database.connect();
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../src/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../src/build', 'index.html'));
  });
}

// Live Streaming Setup
let ffmpeg = null;
const userSocketMap = {};
const rooms = {};

io.on("connection", (socket) => {
  // Handle stream key to spawn ffmpeg process
  socket.on("StreamKey", (streamKey) => {
    if (ffmpeg) {
      console.log("Killing previous FFmpeg process before starting a new one.");
      ffmpeg.kill("SIGTERM");
      ffmpeg = null;
    }

    ffmpeg = spawn("ffmpeg", [
      "-f", "webm",
      "-i", "pipe:0",
      "-c:v", "libx264",
      "-preset", "fast",
      "-b:v", "2500k",
      "-f", "flv",
      `rtmp://a.rtmp.youtube.com/live2/${streamKey}`,
    ]);

    ffmpeg.stdout.on("data", () => {
      // Optional: handle stdout data if needed
    });

    ffmpeg.stderr.on("data", (data) => {
      console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      console.log(`ffmpeg process exited with code ${code}`);
      ffmpeg = null;
    });
  });

  // Handle binary stream input
  socket.on("binarystream", (data) => {
    if (ffmpeg && ffmpeg.stdin.writable) {
      ffmpeg.stdin.write(Buffer.from(data));
    } else {
      console.error("FFmpeg process is not running!");
    }
  });

  socket.on("stopStream", () => {
    if (ffmpeg) {
      console.log("Stopping the stream...");
      ffmpeg.stdin.end();
      ffmpeg.kill("SIGINT");
      console.log("Stream stopped. FFmpeg process killed.");
      ffmpeg = null;
    } else {
      console.log("No active stream found to stop.");
    }
  });
});

// Helper functions to get connected clients
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

// Live Code Editor socket logic
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    for (const [socketId, user] of Object.entries(userSocketMap)) {
      if (user === username) {
        console.log(`Removing previous connection for user ${username}`);
        delete userSocketMap[socketId];
        io.to(socketId).emit(ACTIONS.DISCONNECTED, { socketId, username });
      }
    }

    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

    if (rooms[roomId]) {
      socket.emit(ACTIONS.CODE_CHANGE, { code: rooms[roomId] });
    }
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    rooms[roomId] = code;
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('disconnecting', () => {
    const roomsJoined = [...socket.rooms];
    roomsJoined.forEach(roomId => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
