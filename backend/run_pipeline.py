#!/usr/bin/env python3
"""
Main pipeline runner for the Drug Safety Engine.
Downloads datasets, processes Ibuprofen data, and runs example assessments.
"""

import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent


def run_script(script_path: str, description: str):
    """Run a Python script and handle errors."""
    print(f"\n{'='*60}")
    print(f"RUNNING: {description}")
    print(f"{'='*60}\n")

    result = subprocess.run(
        [sys.executable, script_path],
        cwd=BASE_DIR,
        capture_output=False
    )

    if result.returncode != 0:
        print(f"WARNING: {description} completed with errors")
        return False
    return True


def main():
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║     DRUG SAFETY ENGINE - HYPER-PERSONALIZED PIPELINE      ║
    ║                    Ibuprofen (CID 3672)                   ║
    ╚═══════════════════════════════════════════════════════════╝
    """)

    # Step 1: Download datasets
    download_script = BASE_DIR / "scripts" / "download_datasets.py"
    run_script(str(download_script), "Download Datasets (SIDER, OnSIDES, Interactions)")

    # Step 2: Process Ibuprofen data
    process_script = BASE_DIR / "scripts" / "process_ibuprofen.py"
    run_script(str(process_script), "Process Ibuprofen Data")

    # Step 3: Run risk engine examples
    engine_script = BASE_DIR / "src" / "risk_engine.py"
    run_script(str(engine_script), "Run Risk Engine Examples")

    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║                    PIPELINE COMPLETE                       ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  Processed data saved to: data/processed/                  ║
    ║                                                            ║
    ║  Key files:                                                ║
    ║    - ibuprofen_unified.json    (complete dataset)          ║
    ║    - ibuprofen_side_effects.csv                            ║
    ║    - ibuprofen_contraindications.csv                       ║
    ║    - ibuprofen_interactions.csv                            ║
    ║    - ibuprofen_demographic_risks.csv                       ║
    ║                                                            ║
    ║  To use the risk engine:                                   ║
    ║    from src.risk_engine import IbuprofenRiskEngine         ║
    ║    engine = IbuprofenRiskEngine()                          ║
    ║    assessment = engine.assess_risk(user_profile)           ║
    ╚═══════════════════════════════════════════════════════════╝
    """)


if __name__ == "__main__":
    main()
