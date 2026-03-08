#!/usr/bin/env python3
"""
Hadoop MapReduce Job 1 – Crop Yield Aggregation
Mapper: Reads raw predictions CSV, emits (crop_type, yield) pairs
Team: Sanjay Kanna K J, Sanjay Karthi R P, Samiksha R, Samni T K G, Sandhiya K
"""
import sys

for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith('temperature'):  # skip header
        continue
    parts = line.split(',')
    if len(parts) < 8:
        continue
    try:
        crop_type = parts[4].strip().lower()
        yield_val = float(parts[7].strip())
        # Emit: crop_type \t yield
        print(f"{crop_type}\t{yield_val}")
    except (ValueError, IndexError):
        continue
