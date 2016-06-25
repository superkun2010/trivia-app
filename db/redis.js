'use strict'
let redis = require("redis");
//Give redis promises
let bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
//Create a client & configure
let client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379/0"
});
module.exports = client;
