#!/usr/bin/env python3
"""
Hadoop MapReduce Job 3 – Temperature-Yield Correlation
Reducer: Outputs avg yield per temperature bucket (sorted)
"""
import sys

current_bucket = None
yields = []

def emit(bucket, vals):
    if not vals:
        return
    count = len(vals)
    avg   = sum(vals) / count
    print(f"{bucket}-{bucket+2}°C\t{count}\t{avg:.4f}")

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    parts = line.split('\t')
    if len(parts) != 2:
        continue
    try:
        bucket = int(parts[0])
        y      = float(parts[1])
    except ValueError:
        continue
    if bucket == current_bucket:
        yields.append(y)
    else:
        if current_bucket is not None:
            emit(current_bucket, yields)
        current_bucket = bucket
        yields = [y]

if current_bucket is not None:
    emit(current_bucket, yields)
