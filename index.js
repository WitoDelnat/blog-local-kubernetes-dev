const http = require("http");
const express = require("express");
const { Storage } = require("@google-cloud/storage");
const { Client } = require("pg");

const app = express();

app.get("/hello", (_, response) => {
  console.log("GET /hello");
  response.json({ message: "hello world" });
});

app.get("/hello-gcp", async (_, response) => {
  try {
    console.log("GET /hello-gcp");
    const [buckets] = await new Storage().getBuckets();
    const gcpMessage =
      buckets.length === 0
        ? "No buckets found"
        : buckets.map((bucket) => bucket.id).join();
    response.json({
      message: `hello world from gcp: ${gcpMessage}`,
    });
  } catch (err) {
    console.log("GET /hello-gcp failed", err.message);
    response.json({ message: `request failed` });
  }
});

app.get("/hello-pg", async (_, response) => {
  try {
    console.log("GET /hello-pg");
    const client = new Client({
      connectionString: "postgres://api-user:api-password@database:5432/api-db",
    });
    client.connect();
    const res = await client.query("SELECT $1::text as message", [
      "hello world from postgres",
    ]);
    const message = res.rows[0].message;
    client.end();
    response.json({ message });
  } catch (err) {
    console.log("GET /hello-pg failed", err.message);
    response.json({ message: `request failed` });
  }
});

http.createServer(app).listen(8080, "0.0.0.0", () => {
  console.log(`🚀 server running`);
});
