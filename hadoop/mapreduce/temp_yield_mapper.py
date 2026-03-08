#!/usr/bin/env python3
"""
Hadoop MapReduce Job 3 – Temperature-Yield Correlation
Mapper: Buckets temperature into 2°C intervals, emits (temp_bucket, yield)
"""
import sys

for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith('temperature'):
        continue
    parts = line.split(',')
    if len(parts) < 8:
        continue
    try:
        temp      = float(parts[0].strip())
        yield_val = float(parts[7].strip())
        # 2°C bucket
        bucket = int(temp // 2) * 2
        print(f"{bucket}\t{yield_val}")
    except (ValueError, IndexError):
        continue
