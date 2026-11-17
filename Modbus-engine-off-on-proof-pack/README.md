# Modbus engine-off vs engine-on proof run

One named attack, sent twice with byte-identical frames, against the live
v3.1 Modbus/TCP guard proxy on EC2 — plus a legit control. Run live on
2026-11-14 at about 09:16 UTC (03:16 CST) from the EC2 terminal.

## The attack

FC16 multi-value misaligned firmware write, values [52, 53] to register
0x4000 — value 53 lands on reg 0x4001 and is not 4-byte aligned. This is the
v3.1 fix case, framed as the GPL750-style Modbus register-manipulation chain
(CVE-2026-4436: a low-privileged remote attacker sends Modbus packets to
manipulate register values).

## Results

| Leg | What | Sent | Received | Verdict |
|-----|------|------|----------|---------|
| 1 | Attack, gate bypassed (direct to target 127.0.0.1:5023) | 00010000000b0110400000020400340035 | 00010000000b0110400000020400340035 (echo) | FORWARDED |
| 2 | Same attack, through the gate (127.0.0.1:5020) | 00010000000b0110400000020400340035 | 000100000003019001 (Modbus exception 90 01) | BLOCKED |
| 3 | Legit write [52, 52], through the gate | 00010000000b0110400000020400340034 | 00010000000b0110400000020400340034 (echo) | FORWARDED |

The gate's own log confirms legs 2 and 3 at matching timestamps
(`gate_log_excerpt.jsonl`): 09:16:13 UTC, "Alignment violation in
multi-write: firmware write value 53 to reg 0x4001 not 4-byte aligned",
allowed false, status Blocked, attack true; 09:16:33 UTC, OK, allowed true.
Leg 1 has no gate log line because it bypassed the gate entirely — that is
expected, not a gap.

## Files

- `results.json` — the three legs with timestamps, exact bytes, and verdicts.
- `gate_log_excerpt.jsonl` — the verbatim `tail -5` output of the gate log
  from the run. Only the two 09:16 UTC lines are from this run; the three
  earlier lines (03:12–03:14 UTC) are prior allowed FC16 events.
- `leg1_attack.sent.bin` / `leg1_attack.recv.bin` — raw bytes, leg 1.
- `leg2_attack.sent.bin` / `leg2_attack.recv.bin` — raw bytes, leg 2.
- `leg3_legit.sent.bin` / `leg3_legit.recv.bin` — raw bytes, leg 3.

## What this proves — and what it does not

Proves: the live v3.1 gate on EC2 intercepts this real Modbus/TCP attack
frame on the wire (engine on) while the identical frame reaches the target
with the gate bypassed (engine off), with the gate's own JSON log as the
record, and a legit write still passes through.

Does NOT prove: protection of a real GPL750, a real PLC, or any production
hardware. The target is a lab dummy Modbus target on the same EC2 box. No
latency, line-rate, patent, or CWE claims are made.

Note: during the run the gate was listening on 0.0.0.0:5020 (all interfaces),
while the dummy target listened on 127.0.0.1:5023. Whether the gate is
reachable from outside the box depends on the EC2 security group, which was
not checked in this run.
