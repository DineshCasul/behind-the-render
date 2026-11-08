# Live database migration: double-write, backfill, verify, switch

## What it is

A way to move data from one database to another while the product keeps running. Instead of one big cutover, you move in stages, and each stage can be checked and undone:

1. **Double-write.** Every new write goes to the old database and the new one.
2. **Backfill.** Copy the old data across, but never overwrite something newer.
3. **Verify.** Compare the two, with a script and with reads that go to both.
4. **Switch.** Move reads, then writes, to the new one. Keep a way back.

## Why it is used here

Notion's sharding post names this exact framework (double-write, backfill, verification, switch-over). Discord's message migration has the same shape: dual-write, a fast migrator, compare a small percentage of reads, flip the switch. Two independent companies landing on one pattern is a good sign it is the pattern. It is the trick `migrate-live`.

## Where it lives

- `data/journey-deep.ts`: the chapters `notion-move` and `discord-move`, with the quotes.
- `data/tricks.ts`: the trick `migrate-live`.
- `data/trick-extras.ts`: the sketch, the steps and the pitfalls.

## How it works at runtime (the general idea)

The old database stays the source of truth until the switch. The new one is fed by a log (or by replication, or by writing to both), so it catches up. The backfill carries a version check, so an old row never lands on top of a newer one. Verification reads from both and logs differences; "dark reads" do this without the user seeing the second answer. Only when the differences are zero, or explained, do you flip.

Nothing here runs on the server or in the browser in a special way. It is a data-engineering pattern. The site only describes it.

## Things the sources taught that are easy to miss

- **Write directly to both?** It looks simple, but if either write fails the two drift. Notion chose an audit log plus a catch-up script, and also found logical replication could not keep up with the block table's write volume during the initial snapshot.
- **Who checks the migration?** Notion had the migration and the verification written by different people, so one mistake would not be in both.
- **The last 0.0001%.** Discord's migrator stuck at 99.9999% because a few token ranges had huge runs of uncompacted tombstones.
- **Why 480 shards?** Not a power of two on purpose. 480 divides by lots of numbers, so 32 hosts can become 40 or 48 and the shards stay even. A power of two forces doubling. See `notion-480`.

## Interview questions

1. *"You have to move a live database with almost no downtime. What is your plan?"* The four stages above, plus a way back, plus a note that you run two systems for a while.
2. *"How do you stop a backfill from overwriting a newer write?"* Compare a version or timestamp first and skip older data.
3. *"Why not just use the database's built-in replication?"* It may not allow you to change data in flight, and it may not keep up with write volume during the snapshot (Notion's experience).
4. *"How do you decide when it is safe to switch?"* Zero unexplained differences, a tested way back, and someone other than the author checking.

## Related concepts

[[17-adding-a-site]] · [[18-consistent-hashing-ring]] · Strangler pattern · Shadow reads
