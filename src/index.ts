#!/usr/bin/env node

import { Server, Socket } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";
const express = require("express");

const PORT = process.env.PORT || 4000;

// Create the http server
const server = express()
  .use((req: any, res: any) => res.send(`Hello World! ${PORT}`))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
// Create an io instance
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4000", "yjs-next-13-server.herokuapp.com"],
  },
});

// Create the YSocketIO instance
// NOTE: This uses the socket namespaces that match the regular expression /^\/yjs\|.*$/, make sure that when using namespaces
//       for other logic, these do not match the regular expression, this could cause unwanted problems.
// TIP: You can export a new instance from another file to manage as singleton and access documents from all app.
const ysocketio = new YSocketIO(io, {
  // authenticate: (auth) => auth.token === 'valid-token',
  // levelPersistenceDir: './storage-location',
  // gcEnabled: true,
});

// ysocketio.on('document-loaded', (doc: Document) => console.log(`The document ${doc.name} was loaded`))
// ysocketio.on('document-update', (doc: Document, update: Uint8Array) => console.log(`The document ${doc.name} is updated`))
// ysocketio.on('awareness-update', (doc: Document, update: Uint8Array) => console.log(`The awareness of the document ${doc.name} is updated`))
// ysocketio.on('document-destroy', async (doc: Document) => console.log(`The document ${doc.name} is being destroyed`))
// ysocketio.on('all-document-connections-closed', async (doc: Document) => console.log(`All clients of document ${doc.name} are disconected`))

// Execute initialize method
ysocketio.initialize();

// Handling another socket namespace
io.on("connection", (socket: Socket) => {
  console.log(`[connection] Connected with user: ${socket.id}`);

  // You can add another socket logic here...
  socket.on("disconnect", () => {
    console.log(`[disconnect] Disconnected with user: ${socket.id}`);
  });
});
