#!/usr/bin/env python3
"""
Process all datasets to extract Ibuprofen-specific data.
Creates unified processed datasets for the risk engine.
"""

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

# Ibuprofen identifiers
IBUPROFEN_CID = "3672"
IBUPROFEN_SIDER_ID = "CID100003672"  # SIDER format
IBUPROFEN_NAMES = ["ibuprofen", "advil", "motrin", "nurofen", "brufen"]


def process_sider_side_effects():
    """Process SIDER side effects for Ibuprofen."""
    print("\n" + "-"*50)
    print("Processing SIDER Side Effects...")
    print("-"*50)

    se_path = RAW_DATA_DIR / "sider" / "meddra_all_se.tsv"

    if not se_path.exists():
        print(f"  File not found: {se_path}")
        return None

    # SIDER columns: drug_id, drug_id_2, side_effect_id, side_effect_name (varies by version)
    # Try different column configurations
    try:
        df = pd.read_csv(se_path, sep='\t', header=None)
        print(f"  Loaded {len(df)} total side effect records")

        # Identify Ibuprofen rows (check first few columns for CID)
        ibu_mask = df.apply(lambda row: any(
            IBUPROFEN_SIDER_ID in str(val) or
            f"CID{IBUPROFEN_CID}" in str(val)
            for val in row
        ), axis=1)

        ibu_se = df[ibu_mask].copy()
        print(f"  Found {len(ibu_se)} Ibuprofen side effect records")

        if len(ibu_se) > 0:
            # Typically: col 0 = flat_id, col 1 = stereo_id, col 2 = umls_id, col 3 = meddra_type, col 4 = umls_id_meddra, col 5 = side_effect_name
            if len(df.columns) >= 6:
                ibu_se.columns = ['flat_drug_id', 'stereo_drug_id', 'umls_cui_label', 'meddra_type', 'umls_cui_meddra', 'side_effect_name'][:len(df.columns)]
            # Get unique side effects
            side_effects = ibu_se.iloc[:, -1].unique() if len(ibu_se.columns) > 0 else []
            print(f"  Unique side effects: {len(side_effects)}")

        return ibu_se

    except Exception as e:
        print(f"  Error processing SIDER: {e}")
        return None


def process_sider_frequencies():
    """Process SIDER frequency data for Ibuprofen."""
    print("\n" + "-"*50)
    print("Processing SIDER Frequencies...")
    print("-"*50)

    freq_path = RAW_DATA_DIR / "sider" / "meddra_freq.tsv"

    if not freq_path.exists():
        print(f"  File not found: {freq_path}")
        return None

    try:
        df = pd.read_csv(freq_path, sep='\t', header=None)
        print(f"  Loaded {len(df)} total frequency records")

        # Find Ibuprofen rows
        ibu_mask = df.apply(lambda row: any(
            IBUPROFEN_SIDER_ID in str(val) or
            f"CID{IBUPROFEN_CID}" in str(val)
            for val in row
        ), axis=1)

        ibu_freq = df[ibu_mask].copy()
        print(f"  Found {len(ibu_freq)} Ibuprofen frequency records")

        # Typical columns: drug_id, umls, placebo, frequency, lower_bound, upper_bound, meddra_type, umls_meddra, side_effect_name
        if len(ibu_freq) > 0 and len(df.columns) >= 9:
            ibu_freq.columns = ['flat_drug_id', 'stereo_drug_id', 'umls_cui_label', 'placebo',
                               'frequency', 'freq_lower', 'freq_upper', 'meddra_type',
                               'umls_cui_meddra', 'side_effect_name'][:len(df.columns)]

        return ibu_freq

    except Exception as e:
        print(f"  Error processing frequencies: {e}")
        return None


def process_onsides():
    """Process OnSIDES adverse events for Ibuprofen."""
    print("\n" + "-"*50)
    print("Processing OnSIDES Adverse Events...")
    print("-"*50)

    ae_path = RAW_DATA_DIR / "onsides" / "onsides_adverse_events.csv"
    if not ae_path.exists():
        ae_path = RAW_DATA_DIR / "onsides" / "onsides_v2.0.0_adverse_events.csv"

    if not ae_path.exists():
        print(f"  OnSIDES file not found")
        return None

    try:
        df = pd.read_csv(ae_path)
        print(f"  Loaded {len(df)} total OnSIDES records")
        print(f"  Columns: {list(df.columns)}")

        # Search for Ibuprofen by various identifiers
        ibu_mask = pd.Series([False] * len(df))

        for col in df.columns:
            if df[col].dtype == 'object':
                mask = df[col].str.lower().str.contains('ibuprofen', na=False)
                ibu_mask = ibu_mask | mask
            elif 'cid' in col.lower() or 'pubchem' in col.lower():
                mask = df[col].astype(str).str.contains(IBUPROFEN_CID, na=False)
                ibu_mask = ibu_mask | mask

        ibu_onsides = df[ibu_mask].copy()
        print(f"  Found {len(ibu_onsides)} Ibuprofen OnSIDES records")

        return ibu_onsides

    except Exception as e:
        print(f"  Error processing OnSIDES: {e}")
        return None


def process_onsides_boxed_warnings():
    """Process OnSIDES boxed warnings (most severe warnings)."""
    print("\n" + "-"*50)
    print("Processing OnSIDES Boxed Warnings...")
    print("-"*50)

    bw_path = RAW_DATA_DIR / "onsides" / "onsides_boxed_warnings.csv"
    if not bw_path.exists():
        bw_path = RAW_DATA_DIR / "onsides" / "onsides_v2.0.0_boxed_warnings.csv"

    if not bw_path.exists():
        print(f"  Boxed warnings file not found")
        return None

    try:
        df = pd.read_csv(bw_path)
        print(f"  Loaded {len(df)} total boxed warning records")

        # Search for Ibuprofen
        ibu_mask = pd.Series([False] * len(df))
        for col in df.columns:
            if df[col].dtype == 'object':
                mask = df[col].str.lower().str.contains('ibuprofen', na=False)
                ibu_mask = ibu_mask | mask

        ibu_warnings = df[ibu_mask].copy()
        print(f"  Found {len(ibu_warnings)} Ibuprofen boxed warnings")

        return ibu_warnings

    except Exception as e:
        print(f"  Error processing boxed warnings: {e}")
        return None


def load_curated_contraindications():
    """Load curated contraindications dataset."""
    print("\n" + "-"*50)
    print("Loading Contraindications...")
    print("-"*50)

    contra_path = RAW_DATA_DIR / "contraindications" / "ibuprofen_contraindications.csv"

    if contra_path.exists():
        df = pd.read_csv(contra_path)
        print(f"  Loaded {len(df)} contraindication records")
        return df
    else:
        print("  Contraindications file not found")
        return None


def load_demographic_risks():
    """Load demographic risk factors dataset."""
    print("\n" + "-"*50)
    print("Loading Demographic Risk Factors...")
    print("-"*50)

    demo_path = RAW_DATA_DIR / "contraindications" / "ibuprofen_demographic_risks.csv"

    if demo_path.exists():
        df = pd.read_csv(demo_path)
        print(f"  Loaded {len(df)} demographic risk records")
        return df
    else:
        print("  Demographic risks file not found")
        return None


def load_drug_interactions():
    """Load drug interactions (curated or DDInter)."""
    print("\n" + "-"*50)
    print("Loading Drug Interactions...")
    print("-"*50)

    # Try DDInter first
    ddinter_path = RAW_DATA_DIR / "ddinter" / "DDInter_downloads_all.csv"

    if ddinter_path.exists():
        print("  Using DDInter dataset")
        try:
            df = pd.read_csv(ddinter_path)

            # Search for Ibuprofen interactions
            ibu_mask = pd.Series([False] * len(df))
            for col in df.columns:
                if df[col].dtype == 'object':
                    mask = df[col].str.lower().str.contains('ibuprofen', na=False)
                    ibu_mask = ibu_mask | mask

            ibu_interactions = df[ibu_mask].copy()
            print(f"  Found {len(ibu_interactions)} Ibuprofen interactions in DDInter")
            return ibu_interactions

        except Exception as e:
            print(f"  Error reading DDInter: {e}")

    # Fall back to curated interactions
    curated_path = RAW_DATA_DIR / "interactions" / "ibuprofen_interactions.csv"

    if curated_path.exists():
        print("  Using curated interactions dataset")
        df = pd.read_csv(curated_path)
        print(f"  Loaded {len(df)} curated interaction records")
        return df

    print("  No interaction data found")
    return None


def create_unified_dataset(sider_se, sider_freq, onsides_ae, onsides_bw,
                          contraindications, demographics, interactions):
    """Create a unified processed dataset for the risk engine."""
    print("\n" + "="*50)
    print("Creating Unified Dataset...")
    print("="*50)

    unified = {
        "drug_id": f"CID{IBUPROFEN_CID}",
        "drug_name": "Ibuprofen",
        "drug_class": "NSAID",
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
        se_col = sider_se.columns[-1]  # Last column is usually side effect name
        for _, row in sider_se.iterrows():
            se_name = str(row[se_col])
            if se_name not in [se["name"] for se in unified["side_effects"]]:
                unified["side_effects"].append({
                    "name": se_name,
                    "source": "SIDER",
                    "meddra_type": str(row.get('meddra_type', 'unknown')),
                    "frequency": None,
                    "severity": classify_side_effect_severity(se_name)
                })

    # Add frequencies
    if sider_freq is not None and len(sider_freq) > 0:
        for _, row in sider_freq.iterrows():
            se_name = str(row.iloc[-1])
            freq = row.get('frequency', row.iloc[4] if len(row) > 4 else None)
            # Update existing side effect with frequency
            for se in unified["side_effects"]:
                if se["name"] == se_name:
                    se["frequency"] = parse_frequency(freq)
                    break

    # Process OnSIDES
    if onsides_ae is not None and len(onsides_ae) > 0:
        unified["data_sources"].append("OnSIDES v2")
        # Add unique side effects from OnSIDES
        for col in ['pt_meddra_term', 'adverse_event', 'condition_name']:
            if col in onsides_ae.columns:
                for ae in onsides_ae[col].dropna().unique():
                    ae_name = str(ae)
                    if ae_name not in [se["name"] for se in unified["side_effects"]]:
                        unified["side_effects"].append({
                            "name": ae_name,
                            "source": "OnSIDES",
                            "meddra_type": "PT",
                            "frequency": None,
                            "severity": classify_side_effect_severity(ae_name)
                        })

    # Process boxed warnings
    if onsides_bw is not None and len(onsides_bw) > 0:
        for col in onsides_bw.columns:
            if 'warning' in col.lower() or 'text' in col.lower():
                for warning in onsides_bw[col].dropna().unique():
                    unified["boxed_warnings"].append({
                        "text": str(warning)[:500],  # Truncate long warnings
                        "source": "OnSIDES"
                    })

    # Add NSAID class boxed warnings (FDA requirement)
    unified["boxed_warnings"].extend([
        {
            "text": "CARDIOVASCULAR RISK: NSAIDs may cause an increased risk of serious cardiovascular thrombotic events, myocardial infarction, and stroke, which can be fatal. This risk may increase with duration of use.",
            "source": "FDA Label"
        },
        {
            "text": "GASTROINTESTINAL RISK: NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal.",
            "source": "FDA Label"
        }
    ])

    # Process contraindications
    if contraindications is not None:
        unified["data_sources"].append("Curated Contraindications")
        for _, row in contraindications.iterrows():
            unified["contraindications"].append({
                "condition": row["condition"],
                "icd10_code": row["icd10_code"],
                "severity": row["severity"],
                "reason": row["reason"]
            })

    # Process demographic risks
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

    # Process interactions
    if interactions is not None:
        unified["data_sources"].append("Drug Interactions")
        for _, row in interactions.iterrows():
            unified["drug_interactions"].append({
                "interacting_drug": row.get("drug_b_name", row.iloc[2] if len(row) > 2 else "Unknown"),
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
        "has_boxed_warning": len(unified["boxed_warnings"]) > 0,
        "high_risk_populations": ["Elderly (>65)", "Pregnant (3rd trimester)", "History of GI bleeding",
                                  "Renal impairment", "Cardiovascular disease", "On anticoagulants"]
    }

    return unified


def classify_side_effect_severity(se_name: str) -> str:
    """Classify side effect severity based on name."""
    se_lower = se_name.lower()

    severe_keywords = [
        'death', 'fatal', 'haemorrhage', 'hemorrhage', 'bleeding', 'perforation',
        'infarction', 'stroke', 'anaphyla', 'stevens-johnson', 'toxic epidermal',
        'renal failure', 'kidney failure', 'hepatic failure', 'liver failure',
        'cardiac arrest', 'respiratory failure', 'seizure', 'coma'
    ]

    moderate_keywords = [
        'ulcer', 'hypertension', 'edema', 'oedema', 'tinnitus', 'vertigo',
        'confusion', 'depression', 'anxiety', 'asthma', 'bronchospasm',
        'rash', 'urticaria', 'pruritus', 'dyspnea', 'dyspnoea'
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

    # Try to extract percentage
    import re
    pct_match = re.search(r'(\d+\.?\d*)%', freq_str)
    if pct_match:
        return {
            "value": float(pct_match.group(1)) / 100,
            "type": "percentage",
            "raw": freq_str
        }

    # Map verbal frequencies
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


def save_processed_data(unified_data):
    """Save processed data to files."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    # Save as JSON
    json_path = PROCESSED_DIR / "ibuprofen_unified.json"
    with open(json_path, 'w') as f:
        json.dump(unified_data, f, indent=2, default=str)
    print(f"  Saved: {json_path}")

    # Save side effects as CSV for easy viewing
    if unified_data["side_effects"]:
        se_df = pd.DataFrame(unified_data["side_effects"])
        se_path = PROCESSED_DIR / "ibuprofen_side_effects.csv"
        se_df.to_csv(se_path, index=False)
        print(f"  Saved: {se_path}")

    # Save contraindications as CSV
    if unified_data["contraindications"]:
        contra_df = pd.DataFrame(unified_data["contraindications"])
        contra_path = PROCESSED_DIR / "ibuprofen_contraindications.csv"
        contra_df.to_csv(contra_path, index=False)
        print(f"  Saved: {contra_path}")

    # Save interactions as CSV
    if unified_data["drug_interactions"]:
        int_df = pd.DataFrame(unified_data["drug_interactions"])
        int_path = PROCESSED_DIR / "ibuprofen_interactions.csv"
        int_df.to_csv(int_path, index=False)
        print(f"  Saved: {int_path}")

    # Save demographic risks as CSV
    if unified_data["demographic_risks"]:
        demo_df = pd.DataFrame(unified_data["demographic_risks"])
        demo_path = PROCESSED_DIR / "ibuprofen_demographic_risks.csv"
        demo_df.to_csv(demo_path, index=False)
        print(f"  Saved: {demo_path}")


def main():
    """Main processing pipeline."""
    print("="*60)
    print("IBUPROFEN DATA PROCESSING PIPELINE")
    print("="*60)

    # Process all data sources
    sider_se = process_sider_side_effects()
    sider_freq = process_sider_frequencies()
    onsides_ae = process_onsides()
    onsides_bw = process_onsides_boxed_warnings()
    contraindications = load_curated_contraindications()
    demographics = load_demographic_risks()
    interactions = load_drug_interactions()

    # Create unified dataset
    unified = create_unified_dataset(
        sider_se, sider_freq, onsides_ae, onsides_bw,
        contraindications, demographics, interactions
    )

    # Save processed data
    print("\n" + "-"*50)
    print("Saving Processed Data...")
    print("-"*50)
    save_processed_data(unified)

    # Print summary
    print("\n" + "="*60)
    print("PROCESSING COMPLETE - SUMMARY")
    print("="*60)
    print(f"  Data Sources: {', '.join(unified['data_sources'])}")
    print(f"  Side Effects: {unified['risk_summary']['total_side_effects']} "
          f"({unified['risk_summary']['severe_side_effects']} severe)")
    print(f"  Contraindications: {unified['risk_summary']['total_contraindications']} "
          f"({unified['risk_summary']['absolute_contraindications']} absolute)")
    print(f"  Drug Interactions: {unified['risk_summary']['total_interactions']} "
          f"({unified['risk_summary']['major_interactions']} major)")
    print(f"  Boxed Warnings: {len(unified['boxed_warnings'])}")
    print(f"\n  Output: {PROCESSED_DIR}/")


if __name__ == "__main__":
    main()
