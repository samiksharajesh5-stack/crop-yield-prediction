#!/usr/bin/env python3
"""
run_local_hadoop_simulation.py
Simulates Hadoop MapReduce locally for testing/demo without a real cluster.
Runs all 3 MapReduce jobs on the dataset and produces results.
Team: Sanjay Kanna K J, Sanjay Karthi R P, Samiksha R, Samni T K G, Sandhiya K
"""

import subprocess, sys, os, json
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.parent
DATASET    = SCRIPT_DIR.parent / "backend" / "ml" / "dataset.csv"
MR_DIR     = SCRIPT_DIR / "mapreduce"
RESULTS    = SCRIPT_DIR / "results"
RESULTS.mkdir(exist_ok=True)

def run_job(job_name, mapper_path, reducer_path, input_file, output_file):
    print(f"\n{'='*50}")
    print(f"Running: {job_name}")
    print(f"{'='*50}")

    # Pipe: cat input | mapper | sort | reducer
    cat     = subprocess.Popen(['cat', str(input_file)], stdout=subprocess.PIPE)
    mapper  = subprocess.Popen(['python3', str(mapper_path)],  stdin=cat.stdout, stdout=subprocess.PIPE)
    sorter  = subprocess.Popen(['sort'], stdin=mapper.stdout, stdout=subprocess.PIPE)
    reducer = subprocess.Popen(['python3', str(reducer_path)], stdin=sorter.stdout,
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    stdout, stderr = reducer.communicate()
    if stderr:
        print(f"  Warnings: {stderr.decode()[:200]}")

    lines = stdout.decode().strip().split('\n')
    with open(output_file, 'w') as f:
        f.write('\n'.join(lines) + '\n')

    print(f"✅ Output → {output_file}")
    print(f"   Records: {len(lines)}")
    print("   Sample output:")
    for line in lines[:5]:
        print(f"     {line}")
    return lines

if not DATASET.exists():
    # Try uploads path
    alt = Path("/mnt/user-data/uploads/1772805525851_cleaned_dataset.csv")
    if alt.exists():
        import shutil
        shutil.copy(alt, DATASET)
        print(f"Copied dataset from uploads to {DATASET}")
    else:
        print(f"ERROR: Dataset not found at {DATASET}")
        sys.exit(1)

# Job 1 – Crop Yield
crop_lines = run_job(
    "Job 1 – Crop Yield Aggregation",
    MR_DIR / "crop_yield_mapper.py",
    MR_DIR / "crop_yield_reducer.py",
    DATASET,
    RESULTS / "crop_yield_results.tsv"
)

# Job 2 – Soil Performance
soil_lines = run_job(
    "Job 2 – Soil Performance Analysis",
    MR_DIR / "soil_performance_mapper.py",
    MR_DIR / "soil_performance_reducer.py",
    DATASET,
    RESULTS / "soil_performance_results.tsv"
)

# Job 3 – Temperature vs Yield
temp_lines = run_job(
    "Job 3 – Temperature-Yield Correlation",
    MR_DIR / "temp_yield_mapper.py",
    MR_DIR / "temp_yield_reducer.py",
    DATASET,
    RESULTS / "temp_yield_results.tsv"
)

# Save JSON summary for the API
summary = {
    "crop_yield": [],
    "soil_performance": [],
    "temp_yield_correlation": [],
}

for line in crop_lines:
    parts = line.strip().split('\t')
    if len(parts) == 6:
        summary["crop_yield"].append({
            "crop": parts[0], "count": int(parts[1]),
            "avg_yield": float(parts[2]), "min_yield": float(parts[3]),
            "max_yield": float(parts[4]), "total_yield": float(parts[5])
        })

for line in soil_lines:
    parts = line.strip().split('\t')
    if len(parts) == 6:
        summary["soil_performance"].append({
            "soil": parts[0], "count": int(parts[1]),
            "avg_yield": float(parts[2]), "std_yield": float(parts[3]),
            "min_yield": float(parts[4]), "max_yield": float(parts[5])
        })

for line in temp_lines:
    parts = line.strip().split('\t')
    if len(parts) == 3:
        summary["temp_yield_correlation"].append({
            "temp_range": parts[0], "count": int(parts[1]), "avg_yield": float(parts[2])
        })

with open(RESULTS / "hadoop_summary.json", 'w') as f:
    json.dump(summary, f, indent=2)

print(f"\n{'='*50}")
print("✅ ALL HADOOP JOBS COMPLETE")
print(f"   Results: {RESULTS}/")
print(f"   JSON Summary: {RESULTS}/hadoop_summary.json")
print('='*50)
