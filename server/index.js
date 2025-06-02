  const express = require("express");
  const app = express();
  const userRoutes = require("./routes/user");
  const profileRoutes = require("./routes/profile");
  const courseRoutes = require("./routes/Course");
  const paymentRoutes = require("./routes/Payments");
  const contactUsRoute = require("./routes/Contact");
  const database = require("./config/database");
  const cookieParser = require("cookie-parser");
  const cors = require("cors");
  const { cloudinaryConnect } = require("./config/cloudinary");
  const fileUpload = require("express-fileupload");

  const ACTIONS = require('./utils/Actions');

  const dotenv = require("dotenv");
  const http = require("http");
  const { Server: SocketIO } = require("socket.io");
  const { spawn } = require("child_process"); // Ensure you import spawn here

  dotenv.config();

  const PORT = process.env.PORT || 4000;

  // Create HTTP server
  const server = http.createServer(app);

  // Initialize socket.io with CORS support
  const io = new SocketIO(server, {
    cors: {
      origin: "*",  // Change this if you want to restrict to a specific frontend origin like 'http://localhost:3000'
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  
  // Middleware setup
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:4000/api/v1", // Same here, change to restrict if needed
      credentials: true,
    })
  );
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

  // Connect to the database and cloudinary
  database.connect();
  cloudinaryConnect();

  // Routes setup
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

 
  server.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
  });


// Live Streaming 

let ffmpeg = null;
const userSocketMap = {};
const rooms = {}; 

io.on("connection", (socket) => {
  // console.log("Socket Connected", socket.id);

  socket.on("StreamKey", (streamKey) => {
    // console.log("Received Stream Key:", streamKey);

    // Kill any existing FFmpeg process before starting a new one
    if (ffmpeg) {
      console.log("Killing previous FFmpeg process before starting a new one.");
      ffmpeg.kill("SIGTERM"); // Gracefully terminate any running FFmpeg process
      ffmpeg = null;
    }

    // Start a new FFmpeg process
    ffmpeg = spawn("ffmpeg", [
      "-f", "webm",
      "-i", "pipe:0", // Input from stdin
      "-c:v", "libx264",
      "-preset", "fast",
      "-b:v", "2500k",
      "-f", "flv",
      `rtmp://a.rtmp.youtube.com/live2/${streamKey}`, // Your stream URL
    ]);

    // console.log("FFmpeg process started:", ffmpeg.pid);

    // Log any data received from FFmpeg stdout
    ffmpeg.stdout.on("data", (data) => {
      // console.log(`ffmpeg stdout: ${data}`);
    });

    // Capture and log any FFmpeg error output
    ffmpeg.stderr.on("data", (data) => {
      console.error(`ffmpeg stderr: ${data}`);
    });

    // Handle FFmpeg process exit
    ffmpeg.on("close", (code) => {
      console.log(`ffmpeg process exited with code ${code}`);
      ffmpeg = null;
    });
  });

  socket.on("binarystream", (data) => {
    if (ffmpeg && ffmpeg.stdin.writable) {
      ffmpeg.stdin.write(Buffer.from(data));
    } else {
      console.error("FFmpeg process is not running!");
      return;
    }
  });

  socket.on("stopStream", () => {
    if (ffmpeg) {
      console.log("Stopping the stream...");
      ffmpeg.stdin.end(); // End the input stream

      // Gracefully kill the FFmpeg process
      ffmpeg.kill("SIGINT");
      console.log("Stream stopped. FFmpeg process killed.");
      ffmpeg = null;
    } else {
      console.log("No active stream found to stop.");
    }
  });
});



const path = require("path");

// Serve React static files
const path = require('path');

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../src/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../src/build', 'index.html'));
  });
}



function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}
function getAllUser(roomId){
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => { return {
      username: userSocketMap[socketId],
    };
  });
}

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);
//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//     //   const existingUser = Object.values(userSocketMap).includes(username);
//     //   if(existingUser) {
//     //     console.log(`User ${username} is already in room ${roomId}, preventing duplicate join.`);
//     //     return;
//     // }        

//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });


// Live Code Editor

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      // Remove existing user before adding the new connection
      for (const [socketId, user] of Object.entries(userSocketMap)) {
          if (user === username) {
              console.log(`Removing previous connection for user ${username}`);
              delete userSocketMap[socketId];
              io.to(socketId).emit(ACTIONS.DISCONNECTED, {
                  socketId,
                  username,
              });
          }
      }

      // Add the user to the map
      userSocketMap[socket.id] = username;
      socket.join(roomId);

      // Get all connected clients
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
          io.to(socketId).emit(ACTIONS.JOINED, {
              clients,
              username,
              socketId: socket.id,
          });
      });

      // Send the latest code to the newly joined user
      if (rooms[roomId]) {
          socket.emit(ACTIONS.CODE_CHANGE, { code: rooms[roomId] });
      }
  });

  // Store and sync code changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      rooms[roomId] = code; // Store latest code
      socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle syncing when a new user joins
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle disconnection
  socket.on('disconnecting', () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
          socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
              socketId: socket.id,
              username: userSocketMap[socket.id],
          });
      });
      delete userSocketMap[socket.id];
  });
});
