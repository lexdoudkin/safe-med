#!/usr/bin/env python3
"""
Generic drug processor - extracts data for any drug from SIDER.
Usage: python process_drug.py --cid 2083 --name salbutamol
"""

import argparse
import pandas as pd
import numpy as np
from pathlib import Path
import json
import warnings
warnings.filterwarnings('ignore')

# Paths
BASE_DIR = Path(__file__).parent.parent
RAW_DATA_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

# Drug registry - add new drugs here
DRUG_REGISTRY = {
    "ibuprofen": {
        "cid": "3672",
        "sider_id": "CID100003672",
        "name": "Ibuprofen",
        "drug_class": "NSAID",
        "names": ["ibuprofen", "advil", "motrin", "nurofen", "brufen"]
    },
    "salbutamol": {
        "cid": "2083",
        "sider_id": "CID100002083",
        "name": "Salbutamol",
        "drug_class": "Beta-2 Agonist (Bronchodilator)",
        "names": ["salbutamol", "albuterol", "ventolin", "proventil", "proair"]
    }
}


def get_drug_info(drug_key: str) -> dict:
    """Get drug info from registry."""
    drug_key = drug_key.lower()
    if drug_key in DRUG_REGISTRY:
        return DRUG_REGISTRY[drug_key]

    # Try to find by CID
    for key, info in DRUG_REGISTRY.items():
        if info["cid"] == drug_key or info["sider_id"] == drug_key:
            return info

    raise ValueError(f"Drug '{drug_key}' not found in registry. Available: {list(DRUG_REGISTRY.keys())}")


def process_sider_side_effects(drug_info: dict) -> pd.DataFrame:
    """Process SIDER side effects for a specific drug."""
    print(f"\n  Processing SIDER Side Effects for {drug_info['name']}...")

    se_path = RAW_DATA_DIR / "sider" / "meddra_all_se.tsv"
    if not se_path.exists():
        print(f"    File not found: {se_path}")
        return None

    df = pd.read_csv(se_path, sep='\t', header=None)
    print(f"    Loaded {len(df)} total records")

    # Filter for this drug
    sider_id = drug_info["sider_id"]
    drug_mask = df.apply(lambda row: any(sider_id in str(val) for val in row), axis=1)
    drug_se = df[drug_mask].copy()

    print(f"    Found {len(drug_se)} side effect records for {drug_info['name']}")

    if len(drug_se) > 0 and len(df.columns) >= 6:
        drug_se.columns = ['flat_drug_id', 'stereo_drug_id', 'umls_cui_label',
                          'meddra_type', 'umls_cui_meddra', 'side_effect_name'][:len(df.columns)]

    return drug_se


def process_sider_frequencies(drug_info: dict) -> pd.DataFrame:
    """Process SIDER frequency data for a specific drug."""
    print(f"  Processing SIDER Frequencies for {drug_info['name']}...")

    freq_path = RAW_DATA_DIR / "sider" / "meddra_freq.tsv"
    if not freq_path.exists():
        print(f"    File not found: {freq_path}")
        return None

    df = pd.read_csv(freq_path, sep='\t', header=None)

    sider_id = drug_info["sider_id"]
    drug_mask = df.apply(lambda row: any(sider_id in str(val) for val in row), axis=1)
    drug_freq = df[drug_mask].copy()

    print(f"    Found {len(drug_freq)} frequency records")

    if len(drug_freq) > 0 and len(df.columns) >= 10:
        drug_freq.columns = ['flat_drug_id', 'stereo_drug_id', 'umls_cui_label', 'placebo',
                            'frequency', 'freq_lower', 'freq_upper', 'meddra_type',
                            'umls_cui_meddra', 'side_effect_name'][:len(df.columns)]

    return drug_freq


def load_curated_data(drug_info: dict) -> tuple:
    """Load curated contraindications, demographics, and interactions."""
    drug_name = drug_info["name"].lower()

    # Contraindications
    contra_path = RAW_DATA_DIR / "contraindications" / f"{drug_name}_contraindications.csv"
    contraindications = pd.read_csv(contra_path) if contra_path.exists() else None
    if contraindications is not None:
        print(f"    Loaded {len(contraindications)} contraindications")

    # Demographics
    demo_path = RAW_DATA_DIR / "contraindications" / f"{drug_name}_demographic_risks.csv"
    demographics = pd.read_csv(demo_path) if demo_path.exists() else None
    if demographics is not None:
        print(f"    Loaded {len(demographics)} demographic risk factors")

    # Interactions
    int_path = RAW_DATA_DIR / "interactions" / f"{drug_name}_interactions.csv"
    interactions = pd.read_csv(int_path) if int_path.exists() else None
    if interactions is not None:
        print(f"    Loaded {len(interactions)} drug interactions")

    return contraindications, demographics, interactions


def classify_side_effect_severity(se_name: str, drug_class: str) -> str:
    """Classify side effect severity based on name and drug class."""
    se_lower = se_name.lower()

    severe_keywords = [
        'death', 'fatal', 'haemorrhage', 'hemorrhage', 'anaphyla',
        'cardiac arrest', 'respiratory failure', 'seizure', 'coma',
        'stevens-johnson', 'toxic epidermal', 'arrhythmia', 'ventricular'
    ]

    moderate_keywords = [
        'tachycardia', 'hypertension', 'hypotension', 'tremor',
        'palpitation', 'anxiety', 'insomnia', 'headache', 'dizziness',
        'nausea', 'vomiting', 'rash', 'urticaria', 'bronchospasm'
    ]

    if any(kw in se_lower for kw in severe_keywords):
        return "severe"
    elif any(kw in se_lower for kw in moderate_keywords):
        return "moderate"
    else:
        return "mild"


def parse_frequency(freq_str) -> dict:
    """Parse frequency string into structured data."""
    if pd.isna(freq_str):
        return None

    freq_str = str(freq_str).lower()

    import re
    pct_match = re.search(r'(\d+\.?\d*)%', freq_str)
    if pct_match:
        return {
            "value": float(pct_match.group(1)) / 100,
            "type": "percentage",
            "raw": freq_str
        }

    frequency_map = {
        "very common": {"value": 0.10, "range": ">=10%"},
        "common": {"value": 0.05, "range": "1-10%"},
        "uncommon": {"value": 0.005, "range": "0.1-1%"},
        "rare": {"value": 0.0005, "range": "0.01-0.1%"},
        "very rare": {"value": 0.00005, "range": "<0.01%"}
    }

    for term, data in frequency_map.items():
        if term in freq_str:
            return {
                "value": data["value"],
                "type": "categorical",
                "category": term,
                "range": data["range"],
                "raw": freq_str
            }

    return {"raw": freq_str, "type": "unknown"}


def create_unified_dataset(drug_info: dict, sider_se, sider_freq,
                          contraindications, demographics, interactions) -> dict:
    """Create unified dataset for a drug."""

    unified = {
        "drug_id": f"CID{drug_info['cid']}",
        "drug_name": drug_info["name"],
        "drug_class": drug_info["drug_class"],
        "alternate_names": drug_info["names"],
        "data_sources": [],
        "side_effects": [],
        "boxed_warnings": [],
        "contraindications": [],
        "demographic_risks": [],
        "drug_interactions": [],
        "risk_summary": {}
    }

    # Process SIDER side effects
    if sider_se is not None and len(sider_se) > 0:
        unified["data_sources"].append("SIDER 4.1")
        se_col = sider_se.columns[-1]

        seen_se = set()
        for _, row in sider_se.iterrows():
            se_name = str(row[se_col])
            if se_name not in seen_se:
                seen_se.add(se_name)
                unified["side_effects"].append({
                    "name": se_name,
                    "source": "SIDER",
                    "meddra_type": str(row.get('meddra_type', 'unknown')),
                    "frequency": None,
                    "severity": classify_side_effect_severity(se_name, drug_info["drug_class"])
                })

    # Add frequencies
    if sider_freq is not None and len(sider_freq) > 0:
        for _, row in sider_freq.iterrows():
            se_name = str(row.iloc[-1])
            freq = row.get('frequency', row.iloc[4] if len(row) > 4 else None)
            for se in unified["side_effects"]:
                if se["name"] == se_name:
                    se["frequency"] = parse_frequency(freq)
                    break

    # Add contraindications
    if contraindications is not None:
        unified["data_sources"].append("Curated Contraindications")
        for _, row in contraindications.iterrows():
            unified["contraindications"].append({
                "condition": row["condition"],
                "icd10_code": row["icd10_code"],
                "severity": row["severity"],
                "reason": row["reason"]
            })

    # Add demographic risks
    if demographics is not None:
        unified["data_sources"].append("Demographic Risk Factors")
        for _, row in demographics.iterrows():
            unified["demographic_risks"].append({
                "factor": row["demographic_factor"],
                "category": row["category"],
                "risk_multiplier": float(row["risk_multiplier"]),
                "specific_side_effects": row["specific_side_effects"].split(",") if pd.notna(row["specific_side_effects"]) else [],
                "recommendations": row["recommendations"]
            })

    # Add interactions
    if interactions is not None:
        unified["data_sources"].append("Drug Interactions")
        for _, row in interactions.iterrows():
            unified["drug_interactions"].append({
                "interacting_drug": row.get("drug_b_name", "Unknown"),
                "drug_class": row.get("drug_b_class", ""),
                "severity": row.get("severity", "unknown"),
                "mechanism": row.get("mechanism", ""),
                "clinical_effect": row.get("clinical_effect", ""),
                "recommendation": row.get("recommendation", "")
            })

    # Generate risk summary
    unified["risk_summary"] = {
        "total_side_effects": len(unified["side_effects"]),
        "severe_side_effects": len([se for se in unified["side_effects"] if se["severity"] == "severe"]),
        "total_contraindications": len(unified["contraindications"]),
        "absolute_contraindications": len([c for c in unified["contraindications"] if c["severity"] == "absolute"]),
        "total_interactions": len(unified["drug_interactions"]),
        "major_interactions": len([i for i in unified["drug_interactions"] if i["severity"] == "major"]),
    }

    return unified


def save_processed_data(unified_data: dict, drug_name: str):
    """Save processed data to files."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    drug_name_lower = drug_name.lower()

    # Save as JSON
    json_path = PROCESSED_DIR / f"{drug_name_lower}_unified.json"
    with open(json_path, 'w') as f:
        json.dump(unified_data, f, indent=2, default=str)
    print(f"    Saved: {json_path}")

    # Save CSVs
    if unified_data["side_effects"]:
        se_df = pd.DataFrame(unified_data["side_effects"])
        se_df.to_csv(PROCESSED_DIR / f"{drug_name_lower}_side_effects.csv", index=False)

    if unified_data["contraindications"]:
        contra_df = pd.DataFrame(unified_data["contraindications"])
        contra_df.to_csv(PROCESSED_DIR / f"{drug_name_lower}_contraindications.csv", index=False)

    if unified_data["drug_interactions"]:
        int_df = pd.DataFrame(unified_data["drug_interactions"])
        int_df.to_csv(PROCESSED_DIR / f"{drug_name_lower}_interactions.csv", index=False)


def process_drug(drug_key: str) -> dict:
    """Process a single drug and return unified data."""
    print(f"\n{'='*60}")
    print(f"PROCESSING: {drug_key.upper()}")
    print(f"{'='*60}")

    drug_info = get_drug_info(drug_key)
    print(f"  Drug: {drug_info['name']} (CID: {drug_info['cid']})")
    print(f"  Class: {drug_info['drug_class']}")

    # Process data
    sider_se = process_sider_side_effects(drug_info)
    sider_freq = process_sider_frequencies(drug_info)
    contraindications, demographics, interactions = load_curated_data(drug_info)

    # Create unified dataset
    unified = create_unified_dataset(
        drug_info, sider_se, sider_freq,
        contraindications, demographics, interactions
    )

    # Save
    print(f"\n  Saving processed data...")
    save_processed_data(unified, drug_info["name"])

    # Summary
    print(f"\n  SUMMARY for {drug_info['name']}:")
    print(f"    Side Effects: {unified['risk_summary']['total_side_effects']} ({unified['risk_summary']['severe_side_effects']} severe)")
    print(f"    Contraindications: {unified['risk_summary']['total_contraindications']} ({unified['risk_summary']['absolute_contraindications']} absolute)")
    print(f"    Interactions: {unified['risk_summary']['total_interactions']} ({unified['risk_summary']['major_interactions']} major)")

    return unified


def process_all_drugs():
    """Process all drugs in the registry."""
    print("="*60)
    print("MULTI-DRUG PROCESSING PIPELINE")
    print("="*60)

    all_data = {}
    for drug_key in DRUG_REGISTRY.keys():
        all_data[drug_key] = process_drug(drug_key)

    # Save combined registry
    registry_path = PROCESSED_DIR / "drug_registry.json"
    registry_data = {
        "drugs": list(DRUG_REGISTRY.keys()),
        "drug_info": DRUG_REGISTRY
    }
    with open(registry_path, 'w') as f:
        json.dump(registry_data, f, indent=2)
    print(f"\nSaved drug registry: {registry_path}")

    print("\n" + "="*60)
    print("ALL DRUGS PROCESSED")
    print("="*60)

    return all_data


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process drug data from SIDER")
    parser.add_argument("--drug", type=str, help="Drug name or CID to process (e.g., 'ibuprofen' or '3672')")
    parser.add_argument("--all", action="store_true", help="Process all drugs in registry")

    args = parser.parse_args()

    if args.all:
        process_all_drugs()
    elif args.drug:
        process_drug(args.drug)
    else:
        # Default: process all
        process_all_drugs()
