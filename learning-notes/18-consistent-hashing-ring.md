# Consistent Hashing: The Ring Toy

## What is this?

Consistent hashing assigns keys (a Worker, a user, a cache entry) to servers so that **adding or removing a server moves only a small share of the keys**. The usual approach, `hash(key) % number_of_servers`, changes the answer for almost every key when the number of servers changes.

## Why are we using it here?

Uber's Ringpop and Cloudflare's Worker sharding both describe it. The page for it (`/trick/consistent-hashing`) has a toy, `components/tricks/RingToy.tsx`, so you can add a server and watch which keys move, instead of taking the claim on trust.

## What did we implement?

48 made-up keys sit on a ring. Each server is hashed onto the ring at several points. A key belongs to the first server point at or after it, going clockwise. The toy counts how many keys changed owner on the ring, and how many would have changed with a modulo.

A real run, going from 4 to 5 servers with 8 points each: **14 of 48 keys moved on the ring, 37 of 48 with a modulo.** Theory predicts about 1/5 of the keys for the ring (nearly 10) and about 4/5 for the modulo (about 38). The ring number is higher than ideal because 8 points per server is not perfectly even. Raise the slider and it gets closer.

## How does it work?

```
hash(server + "#" + i)  →  a number from 0 to 2^32  →  an angle on a circle
hash(key)               →  a number                 →  an angle on the same circle

owner of a key = the first server point with position >= the key's position
                 (if there is none, wrap around to the very first point)
```

- **Hash to angle:** `angle = (h / 2^32) × 2π − π/2`, so 0 is at the top and positions run clockwise.
- **Why many points per server:** one point per server lets one server own a long arc and another a tiny one. Many points per server average that out. Ringpop's post says it adds "a uniform number of replica points per node".
- **Why the hash needs a final mix:** FNV-1a on short, similar names (`A#0`, `A#1`, ...) gives results that cluster. Running the result through a final avalanche step (the constants `0x85ebca6b` and `0xc2b2ae35`, from the MurmurHash3 finaliser) spreads them out so the points land all around the ring.
- **Lookup cost:** the toy uses `Array.find` on a sorted list, which is O(n). A real ring uses binary search, O(log n).

## What happens at runtime?

- It is a Client Component (`"use client"`) because of the buttons and the slider.
- Nothing runs on the server except the first render. After that, every render recomputes the owners from the state: the server count `n`, the previous count `prevN`, and the number of points. There are no effects and no stored results to go stale.
- `n` and `prevN` are updated together in one functional `setState`, so "how many keys moved" always compares two counts that really were adjacent.
- What is sent over the network: the page's HTML and the JavaScript for the toy. The hashing happens in the browser.

## Why this approach?

The alternative is to explain the idea in words. A toy that shows 14 against 37 is more convincing than a paragraph, and because the numbers come from code you can read, they are checkable.

## Alternatives

- **Rendezvous (highest random weight) hashing:** each key scores every server and picks the highest. No ring, same minimal-movement property, O(n) per lookup.
- **A lookup table of slots** (a fixed number of slots, each assigned to a server): the approach behind Redis Cluster's hash slots. Moving a slot moves its keys.

## Interview questions

1. **Why does `hash(key) % n` do badly when `n` changes?** (Almost every key's remainder changes, so almost every key moves, and a cache loses most of its entries at once.)
2. **What do the replica points on a ring do?** (They even out how much of the ring each server owns.)
3. **What happens to the keys of a server that fails?** (They move to the next server clockwise. Everything else stays put.)
4. **Senior / scenario:** one key gets a huge share of the traffic. Does consistent hashing help? (No: it balances keys, not traffic. You would replicate or cache that key separately, or split it.)
5. **Debugging:** after adding a server, one old server's load jumped. Why? (It sat just after the new server's points and inherited their arcs. More points per server smooths this.)

## Related concepts

[[08-dynamic-routes-and-static-generation]] · [[Consistent hashing]] · [[Sharding]] · [[Cache stampede]]
