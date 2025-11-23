import { Server } from "socket.io";
import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);

        socket.on("join_room", (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`);
        });

        socket.on("location_update", (data) => {
            // Broadcast to specific room (e.g., admin or owner)
            // data should contain { vehicleId, lat, lng, speed, ... }
            console.log("Location update:", data);
            io.emit(`vehicle_${data.vehicleId}`, data); // Broadcast to subscribers of this vehicle
            io.emit("all_vehicles", data); // Broadcast to admin map
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
