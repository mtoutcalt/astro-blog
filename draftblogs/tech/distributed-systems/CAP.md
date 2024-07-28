## CAP theorem

Consistent - reads are up to date
Available - always get a response
Partition - continue to work even if there are network issues

You can have 2 out of 3 (except in the cloud?)

* If there's no partition, then everything can speak to everything and you have C and A
* Strong consistency - linearizability - reads appear atomic and sequential
* Quorum consistency - majority vote YES to accept the write - possible a client will have a partition issue, though with cloud architectures routing and load balancing mean you can nearly get all 3 of CAP.
* Eventual consistency - reads can return stale data

### Other tradeoffs
* on-disk durability vs. write latency - waiting for the write in-memory to flush onto disk, vs. getting more speed by keeping it in memory longer but risking the loss 