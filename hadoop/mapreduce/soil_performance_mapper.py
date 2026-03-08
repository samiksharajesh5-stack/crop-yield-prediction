#!/usr/bin/env python3
"""
Hadoop MapReduce Job 2 – Soil Performance Analysis
Mapper: Emits (soil_type, yield) to analyse performance per soil type
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
        soil_type = parts[3].strip()
        yield_val = float(parts[7].strip())
        print(f"{soil_type}\t{yield_val}")
    except (ValueError, IndexError):
        continue
