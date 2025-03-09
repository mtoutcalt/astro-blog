# AWS Database & NoSQL Comprehensive Notes

## DynamoDB vs RDS
- HTTP request to DynamoDB API vs. RDS v1 persistent TCP connection
- PostgreSQL limits TCP connections to 100
- No connection pool to init
- DynamoDB can have thousands/millions of concurrent connections
- DAX cache for more cash [performance]
- IAM for calling DynamoDB

## DynamoDB Capacity Units
- DynamoDB → RCU → 1 RPS up to 4kb
- DynamoDB → WCU → 1 WPS up to 1kb
- You can scale Read + Write separately

## Compute Options
- Hyper scale
- Hyper ephemeral compute

## Lambda
- Lambda – pull-based → handle my event processing
- Lambda – push-based → I expect X traffic
- In-memory Redis cache faster than dynamo/http request costs

## Data Processing Types
- OLTP → small bits of data at high speeds
- OLAP → large data sets for processing

## DynamoDB Concepts
- Abstraction (ORM) - objects that are views of multiple tables
- Optimization - indexes/reduce joins/stored procedures
- Abstraction and optimization are opposites
- Scaling - transactional data different than data at rest
- RDB - when in-memory, more expensive for CPU
  - So normalize → dedupe → app is slower to create object view
- NoSQL → no more complex joins

## Application Types
- Most apps - OLTP - same transaction repeated
  - Repeated query/access patterns
  - Good for NoSQL
  - RDS better for ad-hoc

## NoSQL Definition
- Collection of disparate objects tied together by indexed common attributes, queried with constant select statements to produce result sets

## Myths
- Dynamo is just K-V
- Tier 1 - lose nothing if down
- Scaling No-Nos
  - Don't put everything in 1 partition
  - Don't rely on scans
- Schema is enforced at app layer even though DB is "schema-less"

## Document Databases
- Document → Mongo
- Column stores - Cassandra
- Graph DB → Neo4j/Neptune
- Key-value → dict/map/hash table
  - Get 1 item
- Wide-column store - like a bookshelf w/ phone books from each city
  - Key → which city
  - Value → phonebook → B-tree of names and addresses
  - Each row can have different columns
  - Data stored by column on disk
  - Partition by time ranges
  - Could have primary key be ORG/Artifact/Tag/User
  - Good for write-heavy
  - Append-only - not many updates
  - Distributed across nodes

## CAP Theorem
- CAP → Consistency/Availability/Partition Tolerance
- P → continue operating even when nodes can't talk
  - R and W can continue
  - When network back/resolve - maybe hashing order or timestamp order
- C → every read sees most recent write - precision
- A → get a response though it might be stale
- AP - might return stale data (Dynamo) but always get something

## Keys and Schema Design
- PK → entity id → Artifact/Org/Team/ORgg
- SK → timestamp and/or event ID
- Built-in TTL
  - SK → Timestamp#ActivityType
- Attributes → common + unique
- Dynamo → multiple tables:
  - Write: Activity → lambda → Team, Offering, Artifact, Org, Stream
  - Read: Team, Offering, Artifact, Org
- TTL: 24h max, duplicate data, smaller than 10 million?

## Document vs Wide Column
- Document vs Wide Column
  - Self-contained documents - JSON or BSON - compact
  - Own structure with internal relationships
  - Conceptually complete
  - Better for retrieval and nested search on complete document
- Wide-column
  - Flatter - rows + columns w/ columns family partitioning
  - Better for time-series or range scans if partitioned
  - Better for high volume read/write on specific attributes
  - Better append-only time series

## B-trees
- Sorted data
- Search/Insert/Delete (log n)