#!/usr/bin/env python3
"""
Hadoop MapReduce Job 1 – Crop Yield Aggregation
Reducer: Aggregates yields per crop: count, sum, min, max, avg
Output: crop_type \t count \t avg \t min \t max \t total
"""
import sys

current_crop = None
yields = []

def emit(crop, vals):
    if not vals:
        return
    count   = len(vals)
    total   = sum(vals)
    avg     = total / count
    mn      = min(vals)
    mx      = max(vals)
    print(f"{crop}\t{count}\t{avg:.4f}\t{mn:.4f}\t{mx:.4f}\t{total:.4f}")

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    parts = line.split('\t')
    if len(parts) != 2:
        continue
    crop = parts[0]
    try:
        y = float(parts[1])
    except ValueError:
        continue

    if crop == current_crop:
        yields.append(y)
    else:
        if current_crop is not None:
            emit(current_crop, yields)
        current_crop = crop
        yields = [y]

if current_crop is not None:
    emit(current_crop, yields)
