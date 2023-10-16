// import redis from "redis";
// import { promisify } from "util"; // Import the util module to promisify Redis functions

// // Create and initialize the Redis client
// const redisClient = redis.createClient({ host: "suhail", port: 6379 });

// // Promisify Redis functions
// const pingAsync = promisify(redisClient.ping).bind(redisClient);

// // Handle Redis errors
// redisClient.on("error", (err) => {
//   console.error(`Redis Error: ${err}`);
// });

// // Define an asynchronous function to check Redis server status
// async function checkRedisServerStatus() {
//   try {
//     // Connect to the Redis server
//     await new Promise((resolve, reject) => {
//       redisClient.once("ready", resolve);
//       redisClient.once("error", reject);
//     });

//     // Check Redis server status with PING command
//     const reply = await pingAsync();
//     console.log(`Redis Server Status: ${reply}`); // Should print "PONG" if the server is running
//   } catch (error) {
//     console.error(`Redis Error: ${error}`);
//   }
// }

// // Call the function to check Redis server status
// checkRedisServerStatus();
