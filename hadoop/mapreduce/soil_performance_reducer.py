#!/usr/bin/env python3
"""
Hadoop MapReduce Job 2 – Soil Performance Analysis
Reducer: Computes avg yield, count, and yield variance per soil type
"""
import sys, math

current_soil = None
yields = []

def emit(soil, vals):
    if not vals:
        return
    count = len(vals)
    avg   = sum(vals) / count
    variance = sum((x - avg) ** 2 for x in vals) / count
    stddev   = math.sqrt(variance)
    print(f"{soil}\t{count}\t{avg:.4f}\t{stddev:.4f}\t{min(vals):.4f}\t{max(vals):.4f}")

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    parts = line.split('\t')
    if len(parts) != 2:
        continue
    soil = parts[0]
    try:
        y = float(parts[1])
    except ValueError:
        continue
    if soil == current_soil:
        yields.append(y)
    else:
        if current_soil is not None:
            emit(current_soil, yields)
        current_soil = soil
        yields = [y]

if current_soil is not None:
    emit(current_soil, yields)
