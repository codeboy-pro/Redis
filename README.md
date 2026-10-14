# 🚀 Redis: Zero to Hero — Complete Notes

These notes are based on your Redis learning files, including `syl.txt`, `commands.txt`, `string.js`, `list.js`, `client.js`, `server.js`, and `package.json`.

The goal is to help you learn Redis from absolute basics to practical backend development, with simple explanations, terminal commands, Node.js examples, and practice questions.

# 📚 Part 1: Introduction to Redis

## 1. 🌟 What is Redis?

Redis is an in-memory data store used to store and retrieve data very quickly.

Redis stands for Remote Dictionary Server. It stores data as key-value pairs and supports different data structures, including Strings, Lists, Sets, Hashes, and Sorted Sets.

For example, suppose you want to store a student's name.

```
Key          Value
name         Pradip
age          20
branch       IT
```

In Redis, you can write:

```
SET name "Pradip"
SET age 20
SET branch "IT"
```

To retrieve the name:

```
GET name
```

Output:

```
"Pradip"
```

### 🧠 Why is Redis fast?

- ⚡ It primarily serves data from memory (RAM).
- 🔑 It provides efficient commands for common operations.
- 🔄 It supports atomic operations such as `INCR`.
- 🚀 It can reduce the number of requests to slower databases or external APIs.

Redis can also persist data to disk, so it is not necessarily limited to temporary storage.

## 2. 🗄️ Database vs. cache

Imagine that your Node.js application needs to fetch information from an external API.

Without Redis:

```
User → Node.js Server → External API → Response
```

Every request may require another API call.

With Redis:

```
User → Node.js Server → Redis Cache
                          |
                     Cache hit?
                      /     \
                    Yes      No
                     |        |
                  Response  External API
                               |
                         Store in Redis
                               |
                            Response
```

Redis can reduce response time and the number of repeated external requests.

| Term        | Meaning                                                       |
| ----------- | ------------------------------------------------------------- |
| Database    | Stores application data, often as the durable source of truth |
| Cache       | Stores data for faster reuse                                  |
| Cache hit   | Requested data exists in the cache                            |
| Cache miss  | Requested data is absent from the cache                       |
| TTL         | Time to live; how long a key remains before expiry            |
| Persistence | Saving data so it can be recovered after a restart            |

💡 Example: Your application fetches a list of 200 todos from an API. Instead of calling the API every time, it caches the result in Redis for 30 seconds.

## 3. 🐳 Installing Redis using Docker

Your `commands.txt` shows that you installed and ran Redis Stack using Docker.

### Step 1: Start Redis Stack

```
docker run -d \
  --name redis-stack \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest
```

Explanation:

- `docker run` — creates and starts a container.
- `-d` — runs it in the background.
- `--name redis-stack` — assigns the container a name.
- `-p 6379:6379` — exposes the Redis server port.
- `-p 8001:8001` — exposes the Redis Stack browser interface port.

### Step 2: Check whether Redis is running

```
docker ps
```

To inspect its logs:

```
docker logs redis-stack
```

### Step 3: Enter the Redis container

```
docker exec -it redis-stack bash
```

Then run:

```
redis-cli ping
```

Expected output:

```
PONG
```

You can open the Redis command-line interface using:

```
redis-cli
```

You should see a prompt similar to:

```
127.0.0.1:6379>
```

### Step 4: Test Redis

```
PING
SET name "Pradip"
GET name
```

Expected output:

```
PONG
OK
"Pradip"
```

### Useful Docker commands

```
docker stop redis-stack
docker start redis-stack
docker restart redis-stack
docker ps
docker logs redis-stack
docker exec -it redis-stack redis-cli
```

⚠️ If you remove a container, data stored only in its writable container layer may be lost. For data you need to retain, configure persistent storage and appropriate Redis persistence settings.

# 🔑 Part 2: Redis Keys and Basic Commands

## 4. Understanding keys

A key is the name Redis uses to identify stored data.

Examples:

```
SET user:1 "Pradip"
SET user:2 "Riya"
SET msg:1 "Hello"
SET product:101 "Keyboard"
```

The colon (`:`) is simply a naming convention. It helps organize keys logically.

For example:

```
user:1
user:2
user:3
product:101
product:102
cache:todos
session:abc123
```

## 5. Basic Redis commands

| Command  | Purpose                             |
| -------- | ----------------------------------- |
| `PING`   | Check whether Redis responds        |
| `SET`    | Store a String                      |
| `GET`    | Retrieve a String                   |
| `DEL`    | Delete a key                        |
| `EXISTS` | Check whether a key exists          |
| `TYPE`   | Check the data type stored at a key |
| `DBSIZE` | Count keys in the selected database |
| `SCAN`   | Iterate through keys incrementally  |

Example:

```
SET user:1 "Pradip"
GET user:1
EXISTS user:1
TYPE user:1
DEL user:1
EXISTS user:1
```

The final `EXISTS` returns `0` because the key has been deleted.

⚠️ Prefer `SCAN` for incremental key iteration in applications. Avoid using `KEYS *` on a large production database because it can block Redis while scanning all keys.

## 6. ⏳ TTL and expiration

TTL means Time To Live.

Suppose you want an OTP to remain available for only 60 seconds.

```
SET otp:123 "654321" EX 60
```

Redis will automatically expire the key after approximately 60 seconds.

Check the remaining time:

```
TTL otp:123
```

Example output:

```
(integer) 54
```

Other useful commands:

```
EXPIRE otp:123 10
TTL otp:123
PERSIST otp:123
PTTL otp:123
```

| Command/result     | Meaning                                   |
| ------------------ | ----------------------------------------- |
| `EXPIRE key 10`    | Set expiry to 10 seconds                  |
| `TTL key`          | Return remaining lifetime in seconds      |
| `PTTL key`         | Return remaining lifetime in milliseconds |
| `PERSIST key`      | Remove the expiry                         |
| `TTL` returns `-1` | Key exists but has no expiry              |
| `TTL` returns `-2` | Key does not exist                        |

💡 Real-world applications: OTPs, temporary login sessions, verification codes, cache entries, and temporary tokens.

# 🧵 Part 3: Redis Strings

## 7. What is a Redis String?

A Redis String stores a sequence of bytes. It is commonly used for text, numbers, serialized JSON, counters, and tokens.

It is one of the simplest Redis data types.

### 7.1 SET and GET

```
SET name "Pradip Maity"
GET name
```

Output:

```
"Pradip Maity"
```

### 7.2 MSET and MGET

Use `MSET` to store several String keys in one command.

```
MSET user:1 "Pradip" user:2 "Riya"
```

Retrieve several values:

```
MGET user:1 user:2
```

Output:

```
1) "Pradip"
2) "Riya"
```

### 7.3 NX and XX

`NX` means only set the key if it does not already exist.

```
SET nickname "Guddu" NX
```

If `nickname` does not exist, Redis sets it.

Now try:

```
SET nickname "NewName" NX
```

If the key already exists, Redis does not overwrite it and returns a nil/null result.

`XX` has the opposite condition: set the key only if it already exists.

```
SET nickname "UpdatedName" XX
```

These options are useful when you need conditional writes.

### 7.4 Other String commands

```
SET message "Hello"
STRLEN message
APPEND message " World"
GET message
```

Output:

```
(integer) 5
(integer) 11
"Hello World"
```

- `STRLEN` returns the String's length in bytes.
- `APPEND` adds content to the end of a String.

### 7.5 🔢 Counters using INCR

Suppose you are building a website and want to count page views.

```
SET views 0
INCR views
INCR views
INCRBY views 10
GET views
```

The final result is:

```
12
```

`INCR` increases the integer by one, while `INCRBY` increases it by the specified amount.

Why is this useful?

Imagine 100 users simultaneously incrementing a counter. Using Redis's atomic `INCR` avoids the lost-update problem that can occur when your application separately reads a value, increments it in JavaScript, and writes it back.

## 8. 💻 Using Strings in Node.js

Your uploaded `string.js` uses the following pattern:

```
const client = require("./client");

async function init() {
    await client.set("msg:6", "Hey I am from node js");
    await client.expire("msg:6", 10);

    const res = await client.get("msg:6");

    console.log("Result-->", res);
}

init();
```

Explanation:

1. Import the Redis client.
2. Store a message using `SET`.
3. Set the key's expiry to 10 seconds.
4. Retrieve the value using `GET`.
5. Print the result.

Expected output:

```
Result--> Hey I am from node js
```

After the key expires, `GET msg:6` returns `null`.

A useful improvement is to combine the write and expiry into one command:

```
await client.set("msg:6", "Hey I am from node js", "EX", 10);
```

This avoids the gap between setting the value and setting its expiry.

# 📚 Part 4: Redis Lists — Queues and Stacks

## 9. What is a Redis List?

A Redis List is an ordered collection of values.

For example:

```
messages = ["Hello", "How are you?", "Good morning"]
```

You can insert and remove values from either end of the List.

Redis Lists are useful for:

- 📥 Simple queues
- 📤 Task processing
- 📚 Stack operations
- 📨 Message buffers

## 9.1 LPUSH and RPUSH

`LPUSH` inserts values at the left end.

```
LPUSH messages "Hello"
LPUSH messages "World"
LPUSH messages "Redis"
```

Now check the List:

```
LRANGE messages 0 -1
```

Output:

```
1) "Redis"
2) "World"
3) "Hello"
```

Why? Every new value was inserted at the beginning.

`RPUSH` inserts values at the right end:

```
RPUSH messages "First"
RPUSH messages "Second"
RPUSH messages "Third"
```

Now:

```
LRANGE messages 0 -1
```

Output:

```
1) "First"
2) "Second"
3) "Third"
```

## 9.2 Important List commands

| Command  | Purpose                      |
| -------- | ---------------------------- |
| `LPUSH`  | Insert at the left           |
| `RPUSH`  | Insert at the right          |
| `LPOP`   | Remove from the left         |
| `RPOP`   | Remove from the right        |
| `LRANGE` | Retrieve a range of elements |
| `LLEN`   | Count elements               |
| `LINDEX` | Retrieve an element by index |

Example:

```
RPUSH fruits "Apple" "Banana" "Mango"

LLEN fruits
LINDEX fruits 0
LRANGE fruits 0 -1
LPOP fruits
RPOP fruits
```

Remember that indexes start at `0`. The index `-1` means the last element when used as a List index or range endpoint.

## 9.3 🔄 Implementing a queue

A queue follows FIFO — First In, First Out.

Think about students standing in a line. The first student to join the line is the first student served.

Example:

```
LPUSH jobs "job-1"
LPUSH jobs "job-2"
LPUSH jobs "job-3"
```

Now remove jobs from the right:

```
RPOP jobs
RPOP jobs
RPOP jobs
```

The order is:

```
job-1
job-2
job-3
```

Although we inserted at the left, we removed from the right. This gives FIFO behavior.

## 9.4 📦 Implementing a stack

A stack follows LIFO — Last In, First Out.

Think about a pile of plates: the last plate placed on top is the first one removed.

```
LPUSH stack "A"
LPUSH stack "B"
LPUSH stack "C"
```

Now:

```
LPOP stack
```

Output:

```
"C"
```

The last inserted item is removed first.

## 9.5 Blocking List commands

```
BLPOP jobs 0
BRPOP jobs 0
```

These commands wait until an item is available.

- `BLPOP` waits for an item at the left.
- `BRPOP` waits for an item at the right.
- A timeout of `0` means wait indefinitely.

They can be useful for simple worker queues. For systems that need durable event history, acknowledgements, and recovery, consider Redis Streams or a dedicated queue library.

## 9.6 Your `list.js` explained

Your uploaded code follows this pattern:

```
const client = require("./client");

async function init() {
    const res = await client.rpop("messages");
    console.log("Result-->", res);
}

init();
```

The `RPOP` command removes and returns the rightmost element of the List named `messages`.

Your earlier `LPUSH` commands are commented out, so this file expects the List to have been populated already.

If the List is empty or does not exist, `RPOP` returns `null`.

# 🧺 Part 5: Redis Sets

## 10. What is a Set?

A Redis Set is an unordered collection of unique members.

Unlike a List, a Set does not allow duplicate members.

Imagine that you are maintaining a list of students enrolled in a course.

```
SADD students "Pradip"
SADD students "Riya"
SADD students "Aman"
SADD students "Pradip"
```

The last command does not add a duplicate.

Check the members:

The Set contains only three unique students. The output order is not guaranteed.

## 10.1 Important Set commands

| Command     | Purpose                                 |
| ----------- | --------------------------------------- |
| `SADD`      | Add members                             |
| `SMEMBERS`  | Retrieve all members                    |
| `SISMEMBER` | Check whether a member exists           |
| `SCARD`     | Count members                           |
| `SREM`      | Remove members                          |
| `SINTER`    | Find common members                     |
| `SUNION`    | Combine Sets                            |
| `SDIFF`     | Find members in one Set but not another |

Example:

`SISMEMBER` returns `1` if the member exists and `0` otherwise.

## 10.2 🔍 Set operations

Suppose you have two courses.

### Intersection

Who is studying both courses?

Output:

### Union

Who is studying at least one course?

The result contains Pradip, Riya, and Aman.

### Difference

Who is studying frontend but not backend?

The result contains Riya.

### 🧠 When should you use Sets?

Use Sets when you need uniqueness or membership checks.

Examples:

- Unique tags on a post
- Users who liked a particular item
- Course enrollment
- Tracking online users
- Comparing group memberships

Remember: Use a Set for uniqueness. Use a Sorted Set when you need ranking or score-based ordering.

# 🗂️ Part 6: Redis Hashes

## 11. What is a Redis Hash?

A Redis Hash stores multiple field-value pairs under one key.

It resembles a JavaScript object or a dictionary.

For example, a student profile could look like: