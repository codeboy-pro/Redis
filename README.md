//for complete learning read the word fiile(https://docs.google.com/document/d/1dPJ5qbUB_y7nOkorWXF9uUwRt3ox06_u/edit?usp=sharing&ouid=100757758825633574707&rtpof=true&sd=true)


# 🚀 Redis Short Notes — Quick Revision

Beginner-friendly notes for learning, practicals, and interviews.

## 1. 🌟 What is Redis?

Redis (Remote Dictionary Server) is an in-memory data store that stores data in RAM for very fast access. It supports multiple data structures and can also persist data to disk.

Uses: Caching, sessions, counters, queues, leaderboards, and real-time messaging.

- Key: Name used to identify data.
- Value: Data stored under a key.
- TTL: Time To Live — how long a key remains before expiry.
- Cache hit: Data found in cache.
- Cache miss: Data not found in cache.

## 2. 🐳 Redis installation using Docker

```
docker run -d --name redis-stack \
  -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

```
docker ps
docker stop redis-stack
docker start redis-stack
docker exec -it redis-stack redis-cli
```

Test Redis:

```
PING
```

Output: `PONG`

- Port `6379` — Redis server.
- Port `8001` — Redis Stack browser interface, when provided by the image.

## 3. 🔑 Basic Redis commands

| Command         | Purpose                             |
| --------------- | ----------------------------------- |
| `PING`          | Check connection                    |
| `SET key value` | Store a String                      |
| `GET key`       | Retrieve a String                   |
| `DEL key`       | Delete a key                        |
| `EXISTS key`    | Check whether a key exists          |
| `TYPE key`      | Check data type                     |
| `DBSIZE`        | Count keys in the selected database |
| `SCAN 0`        | Start iterating through keys        |

Example:

```
SET user:1 "Pradip"
GET user:1
EXISTS user:1
TYPE user:1
```

## 4. ⏳ TTL and expiration

```
SET otp "123456" EX 60
TTL otp
EXPIRE otp 10
PERSIST otp
PTTL otp
```

- `EX` — set expiry in seconds while writing.
- `TTL` — remaining lifetime in seconds.
- `PTTL` — remaining lifetime in milliseconds.
- `EXPIRE` — set an expiry.
- `PERSIST` — remove the expiry.
- `TTL = -1` — key exists without expiry.
- `TTL = -2` — key does not exist.

Use cases: OTPs, temporary sessions, and cache entries.

## 5. 🧵 Redis data types

String — single value or counter

```
SET name "Pradip"
GET name
INCR views
INCRBY views 10
```

Use for text, tokens, serialized JSON, and counters.

List — ordered sequence

```
LPUSH jobs "job1"
RPUSH jobs "job2"
LRANGE jobs 0 -1
LPOP jobs
RPOP jobs
```

Use for queues and stacks. Queue = FIFO; stack = LIFO.

Set — unique, unordered members

```
SADD students "Pradip" "Riya"
SMEMBERS students
SISMEMBER students "Riya"
SREM students "Riya"
```

Use for unique tags, memberships, and likes.

Hash — multiple field-value pairs

```
HSET user:1 name "Pradip" branch "IT"
HGET user:1 name
HGETALL user:1
HDEL user:1 branch
```

Use for user profiles and object-like records.

Sorted Set — unique members ordered by score

```
ZADD leaderboard 100 "Pradip"
ZRANGE leaderboard 0 -1 WITHSCORES
ZREVRANGE leaderboard 0 -1 WITHSCORES
```

Use for leaderboards, rankings, and priority ordering.

## 6. 🧠 Important data-structure differences

| Data type   | Main feature                    | Example use              |
| ----------- | ------------------------------- | ------------------------ |
| String      | One value                       | Counter                  |
| List        | Ordered, duplicates allowed     | Queue                    |
| Set         | Unique members                  | Tags                     |
| Hash        | Fields and values               | User profile             |
| Sorted Set  | Unique members with scores      | Leaderboard              |
| Stream      | Retained event entries          | Event processing         |
| Pub/Sub     | Live message delivery           | Notifications            |
| Geospatial  | Coordinates and nearby searches | Nearby stores            |
| Bitmap      | Bit-level operations            | Attendance flags         |
| HyperLogLog | Approximate distinct count      | Unique visitor estimates |

## 7. 🌊 Streams vs Pub/Sub

Redis Streams

```
XADD orders * order_id 101 status created
XRANGE orders - +
XLEN orders
```

- Stores event entries.
- Supports replay and consumer groups.
- Useful for event processing and worker systems.

Redis Pub/Sub

Terminal 1:

```
SUBSCRIBE notifications
```

Terminal 2:

```
PUBLISH notifications "Hello!"
```

- Delivers messages to active subscribers.
- Does not retain messages for offline subscribers.

Remember: Streams retain history; Pub/Sub delivers live messages.

## 8. ⚡ Redis with Node.js

Install dependencies:

```
npm install ioredis express axios
```

Create `client.js`:

```
const Redis = require("ioredis");
const client = new Redis();

module.exports = client;
```

Example:

```
const client = require("./client");

async function main() {
  await client.set("message", "Hello Redis", "EX", 30);

  const result = await client.get("message");
  console.log(result);
}

main().catch(console.error);
```

Output:

```
Hello Redis
```

The key expires after 30 seconds.

## 9. 🚀 Redis caching in Express

Cache-aside pattern:

1\. Client requests data

2\. Check Redis cache

Cache hit

Return cached data

Cache miss

Fetch from API/database

Store in Redis with TTL

Example:

```
const cached = await client.get("todos");

if (cached) {
  return res.json(JSON.parse(cached));
}

const { data } = await axios.get(
  "https://jsonplaceholder.typicode.com/todos"
);

await client.set("todos", JSON.stringify(data), "EX", 30);
return res.json(data);
```

Benefits: Faster repeated requests, fewer API calls, and reduced load on the original data source.

Pitfalls: Stale data, simultaneous cache misses, Redis outages, and incorrect cache keys for user-specific data.

## 10. 🛡️ Persistence and performance

- RDB: Saves point-in-time snapshots.
- AOF: Records write operations for recovery.
- Replication: Maintains copies of data across servers.
- Sentinel: Supports monitoring and failover.
- Redis Cluster: Distributes data across nodes.
- Pipelining: Sends multiple commands to reduce network round trips.
- Transactions (`MULTI`/`EXEC`): Execute a group of queued commands together.
- Eviction: Removes keys according to a configured policy when memory limits require it.

🔐 Security: Use authentication/ACLs, network isolation, appropriate TLS, and never expose Redis directly to the public internet without proper protection.

## 11. 📌 Redis command cheat sheet

| Command                 | Meaning               |
| ----------------------- | --------------------- |
| `SET k v` / `GET k`     | Write / read          |
| `SET k v NX`            | Write only if absent  |
| `SET k v XX`            | Write only if present |
| `INCR k`                | Increment counter     |
| `LPUSH k v` / `RPOP k`  | Queue pattern         |
| `SADD k v`              | Add unique member     |
| `SINTER a b`            | Common Set members    |
| `HSET k f v`            | Set Hash field        |
| `ZADD k score member`   | Add ranked member     |
| `XADD k * f v`          | Append Stream entry   |
| `PUBLISH ch msg`        | Publish live message  |
| `GEOADD k lon lat name` | Store a location      |
| `SCAN 0`                | Iterate through keys  |

## 12. 🎯 Quick interview revision

1. Why is Redis fast? It primarily serves data from memory and provides efficient data structures and commands.
2. Is Redis only a cache? No. It can also support counters, sessions, queues, leaderboards, and event processing.
3. What is TTL? The remaining lifetime of a key before expiry.
4. List vs Set? Lists are ordered and allow duplicates; Sets contain unique members without guaranteed order.
5. Set vs Sorted Set? Sorted Sets associate each member with a score.
6. Why use `INCR`? It performs an atomic increment.
7. What is cache-aside? Check cache first; on a miss, fetch the source data and cache it.
8. RDB vs AOF? Snapshots versus a recorded sequence of write operations.
9. Streams vs Pub/Sub? Retained events versus live messages without offline history.
10. Why use expiry? To limit how long temporary or cached data remains available.

### 🧠 Final memory trick

String = Value | List = Sequence | Set = Unique | Hash = Fields | Sorted Set = Ranking | Stream = Event history | Pub/Sub = Live messages

Master these basics first, then practise each command in `redis-cli` and build a small Express caching project. That combination will make Redis much easier to understand in real backend development.
