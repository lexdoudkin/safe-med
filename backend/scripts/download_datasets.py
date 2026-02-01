#!/usr/bin/env python3
"""
Download all required datasets for the drug safety engine.
Datasets: SIDER 4.1, OnSIDES, DDInter
"""

import os
import gzip
import shutil
import requests
from pathlib import Path
from tqdm import tqdm

# Base paths
BASE_DIR = Path(__file__).parent.parent
RAW_DATA_DIR = BASE_DIR / "data" / "raw"

# Dataset URLs
DATASETS = {
    # SIDER 4.1 - Side Effects Resource
    "sider_side_effects": {
        "url": "http://sideeffects.embl.de/media/download/meddra_all_se.tsv.gz",
        "filename": "meddra_all_se.tsv.gz",
        "description": "SIDER side effects (drug-side effect pairs)"
    },
    "sider_frequencies": {
        "url": "http://sideeffects.embl.de/media/download/meddra_freq.tsv.gz",
        "filename": "meddra_freq.tsv.gz",
        "description": "SIDER side effect frequencies"
    },
    "sider_indications": {
        "url": "http://sideeffects.embl.de/media/download/meddra_all_indications.tsv.gz",
        "filename": "meddra_all_indications.tsv.gz",
        "description": "SIDER drug indications"
    },
    "sider_drug_names": {
        "url": "http://sideeffects.embl.de/media/download/drug_names.tsv",
        "filename": "drug_names.tsv",
        "description": "SIDER drug ID to name mapping"
    },

    # OnSIDES - Modern AI-extracted side effects with demographic data
    # From Tatonetti Lab - https://github.com/tatonetti-lab/onsides
    "onsides_adverse_events": {
        "url": "https://github.com/tatonetti-lab/onsides/raw/main/data/onsides_v2.0.0_adverse_events.csv.gz",
        "filename": "onsides_adverse_events.csv.gz",
        "description": "OnSIDES adverse events from FDA labels"
    },
    "onsides_boxed_warnings": {
        "url": "https://github.com/tatonetti-lab/onsides/raw/main/data/onsides_v2.0.0_boxed_warnings.csv.gz",
        "filename": "onsides_boxed_warnings.csv.gz",
        "description": "OnSIDES boxed warnings (most severe)"
    },

    # DDInter - Drug-Drug Interactions
    # Download from: http://ddinter.scbdd.com/download/
    # Note: DDInter requires manual download - we'll provide instructions
}

# Additional OnSIDES demographic-specific files (if available)
ONSIDES_DEMOGRAPHIC_FILES = {
    "pediatric": "https://github.com/tatonetti-lab/onsides/raw/main/data/onsides_v2.0.0_pediatric.csv.gz",
    "geriatric": "https://github.com/tatonetti-lab/onsides/raw/main/data/onsides_v2.0.0_geriatric.csv.gz",
    "pregnancy": "https://github.com/tatonetti-lab/onsides/raw/main/data/onsides_v2.0.0_pregnancy.csv.gz",
}


def download_file(url: str, dest_path: Path, description: str = "") -> bool:
    """Download a file with progress bar."""
    try:
        print(f"\nDownloading: {description or url}")
        response = requests.get(url, stream=True, timeout=60)
        response.raise_for_status()

        total_size = int(response.headers.get('content-length', 0))

        with open(dest_path, 'wb') as f:
            with tqdm(total=total_size, unit='B', unit_scale=True) as pbar:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    pbar.update(len(chunk))

        print(f"  Saved to: {dest_path}")
        return True

    except requests.exceptions.RequestException as e:
        print(f"  ERROR downloading {url}: {e}")
        return False


def decompress_gzip(gz_path: Path, output_path: Path = None) -> Path:
    """Decompress a .gz file."""
    if output_path is None:
        output_path = gz_path.with_suffix('')

    print(f"  Decompressing: {gz_path.name}")
    with gzip.open(gz_path, 'rb') as f_in:
        with open(output_path, 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)

    return output_path


def download_sider():
    """Download SIDER 4.1 datasets."""
    print("\n" + "="*60)
    print("DOWNLOADING SIDER 4.1 (Side Effect Resource)")
    print("="*60)

    sider_dir = RAW_DATA_DIR / "sider"
    sider_dir.mkdir(parents=True, exist_ok=True)

    sider_datasets = {k: v for k, v in DATASETS.items() if k.startswith("sider")}

    for name, info in sider_datasets.items():
        dest_path = sider_dir / info["filename"]

        if dest_path.exists():
            print(f"\n{info['filename']} already exists, skipping...")
            continue

        success = download_file(info["url"], dest_path, info["description"])

        if success and dest_path.suffix == '.gz':
            decompress_gzip(dest_path)


def download_onsides():
    """Download OnSIDES datasets (modern AI-extracted side effects)."""
    print("\n" + "="*60)
    print("DOWNLOADING OnSIDES (AI-Extracted FDA Label Data)")
    print("="*60)

    onsides_dir = RAW_DATA_DIR / "onsides"
    onsides_dir.mkdir(parents=True, exist_ok=True)

    # Main OnSIDES files
    onsides_datasets = {k: v for k, v in DATASETS.items() if k.startswith("onsides")}

    for name, info in onsides_datasets.items():
        dest_path = onsides_dir / info["filename"]

        if dest_path.exists():
            print(f"\n{info['filename']} already exists, skipping...")
            continue

        success = download_file(info["url"], dest_path, info["description"])

        if success and dest_path.suffix == '.gz':
            decompress_gzip(dest_path)

    # Try demographic-specific files (may not all exist)
    print("\nAttempting to download demographic-specific files...")
    for demo_type, url in ONSIDES_DEMOGRAPHIC_FILES.items():
        filename = f"onsides_{demo_type}.csv.gz"
        dest_path = onsides_dir / filename

        if dest_path.exists():
            print(f"\n{filename} already exists, skipping...")
            continue

        success = download_file(url, dest_path, f"OnSIDES {demo_type} data")
        if success and dest_path.suffix == '.gz':
            decompress_gzip(dest_path)


def create_ddinter_instructions():
    """Create instructions for manually downloading DDInter."""
    print("\n" + "="*60)
    print("DDInter (Drug-Drug Interactions)")
    print("="*60)

    ddinter_dir = RAW_DATA_DIR / "ddinter"
    ddinter_dir.mkdir(parents=True, exist_ok=True)

    instructions = """
DDInter Dataset - Manual Download Required
==========================================

DDInter requires manual download from their website.

Steps:
1. Go to: http://ddinter.scbdd.com/download/
2. Download the "All Interactions" file (DDInter_downloads_all.csv)
3. Save it to: data/raw/ddinter/DDInter_downloads_all.csv

Alternative - DrugBank (Academic License):
1. Go to: https://go.drugbank.com/releases/latest
2. Register for academic access
3. Download drug interactions data

Once downloaded, run the processing script:
    python scripts/process_ibuprofen.py
"""

    instructions_path = ddinter_dir / "DOWNLOAD_INSTRUCTIONS.txt"
    with open(instructions_path, 'w') as f:
        f.write(instructions)

    print(instructions)

    # Also try to download from alternative source if available
    # DDInter may have a direct link
    try:
        alt_url = "http://ddinter.scbdd.com/static/data/DDInter_downloads_all.csv"
        dest_path = ddinter_dir / "DDInter_downloads_all.csv"
        if not dest_path.exists():
            print("Attempting direct download...")
            download_file(alt_url, dest_path, "DDInter all interactions")
    except Exception as e:
        print(f"Direct download failed: {e}")
        print("Please download manually following instructions above.")


def create_contraindications_data():
    """Create a curated contraindications dataset for Ibuprofen.

    Since MeDIC may not be readily available, we create a curated dataset
    based on FDA label and clinical guidelines.
    """
    print("\n" + "="*60)
    print("Creating Contraindications Dataset")
    print("="*60)

    contra_dir = RAW_DATA_DIR / "contraindications"
    contra_dir.mkdir(parents=True, exist_ok=True)

    # Ibuprofen contraindications from FDA label and clinical sources
    # ICD-10 codes mapped to conditions
    ibuprofen_contraindications = """drug_id,drug_name,condition,icd10_code,severity,reason
CID3672,Ibuprofen,Peptic Ulcer Disease,K27,absolute,Risk of GI bleeding and perforation
CID3672,Ibuprofen,Active GI Bleeding,K92.2,absolute,Will worsen bleeding
CID3672,Ibuprofen,Chronic Kidney Disease Stage 4-5,N18.4,absolute,Risk of acute kidney injury
CID3672,Ibuprofen,Chronic Kidney Disease Stage 4-5,N18.5,absolute,Risk of acute kidney injury
CID3672,Ibuprofen,Severe Heart Failure,I50.9,absolute,Fluid retention and worsening HF
CID3672,Ibuprofen,CABG Surgery (perioperative),Z95.1,absolute,FDA black box warning
CID3672,Ibuprofen,Third Trimester Pregnancy,O09.93,absolute,Risk of premature ductus closure
CID3672,Ibuprofen,Aspirin-Sensitive Asthma,J45.20,absolute,Risk of bronchospasm
CID3672,Ibuprofen,NSAID Allergy,T88.6,absolute,Anaphylaxis risk
CID3672,Ibuprofen,History of GI Bleeding,K92.2,relative,Increased recurrence risk
CID3672,Ibuprofen,Hypertension (uncontrolled),I10,relative,May increase blood pressure
CID3672,Ibuprofen,Mild-Moderate CKD,N18.3,relative,Monitor renal function
CID3672,Ibuprofen,Liver Cirrhosis,K74.60,relative,Reduced metabolism and bleeding risk
CID3672,Ibuprofen,Elderly (>65 years),Z68.43,relative,Higher GI and renal risk
CID3672,Ibuprofen,Inflammatory Bowel Disease,K50,relative,May trigger flares
CID3672,Ibuprofen,Inflammatory Bowel Disease,K51,relative,May trigger flares
CID3672,Ibuprofen,Coagulation Disorders,D68.9,relative,Bleeding risk
CID3672,Ibuprofen,Systemic Lupus Erythematosus,M32.9,relative,Risk of aseptic meningitis
CID3672,Ibuprofen,Dehydration,E86.0,relative,Increased nephrotoxicity risk
CID3672,Ibuprofen,Alcohol Use Disorder,F10.20,relative,Increased GI bleeding risk
CID3672,Ibuprofen,First/Second Trimester Pregnancy,O09.91,caution,Use only if clearly needed
CID3672,Ibuprofen,Breastfeeding,Z39.1,caution,Small amounts in breast milk
"""

    contra_path = contra_dir / "ibuprofen_contraindications.csv"
    with open(contra_path, 'w') as f:
        f.write(ibuprofen_contraindications)

    print(f"Created: {contra_path}")

    # Also create demographic risk factors
    demographic_risks = """drug_id,drug_name,demographic_factor,category,risk_multiplier,specific_side_effects,recommendations
CID3672,Ibuprofen,age>=65,geriatric,2.5,"GI bleeding,Acute kidney injury,Cardiovascular events",Use lowest effective dose for shortest duration. Consider PPI co-therapy.
CID3672,Ibuprofen,age>=75,very_elderly,3.5,"GI bleeding,Acute kidney injury,Falls,Cognitive effects",Avoid if possible. If necessary use lowest dose with PPI.
CID3672,Ibuprofen,age<12,pediatric,1.2,"Reye syndrome (with viral illness)",Do not use with chickenpox or flu. Weight-based dosing required.
CID3672,Ibuprofen,sex=female,female,1.1,"Fluid retention",Monitor for edema
CID3672,Ibuprofen,pregnant_trimester=3,pregnancy_t3,999.0,"Premature ductus closure,Oligohydramnios",CONTRAINDICATED after 30 weeks gestation
CID3672,Ibuprofen,pregnant_trimester=1,pregnancy_t1,1.5,"Miscarriage risk (controversial)",Use only if clearly needed
CID3672,Ibuprofen,pregnant_trimester=2,pregnancy_t2,1.3,"Fetal kidney effects",Use only if clearly needed
CID3672,Ibuprofen,breastfeeding=true,lactation,1.1,"Minimal infant exposure",Generally considered compatible
CID3672,Ibuprofen,smoker=true,smoker,1.4,"GI bleeding",Increased mucosal damage risk
CID3672,Ibuprofen,alcohol_use=heavy,alcohol,2.0,"GI bleeding,Liver toxicity",Avoid concurrent use
CID3672,Ibuprofen,renal_function=mild_impairment,ckd_mild,1.5,"Acute kidney injury",Monitor creatinine. Avoid dehydration.
CID3672,Ibuprofen,renal_function=moderate_impairment,ckd_moderate,2.5,"Acute kidney injury",Use with extreme caution. Consider alternatives.
CID3672,Ibuprofen,history_gi_bleed=true,gi_history,3.0,"GI bleeding",Co-prescribe PPI. Consider alternative analgesic.
CID3672,Ibuprofen,on_anticoagulant=true,anticoag,3.5,"Bleeding",Avoid if possible. If necessary monitor closely.
CID3672,Ibuprofen,on_aspirin=true,aspirin_user,2.0,"GI bleeding,Reduced cardioprotection",Take ibuprofen 30min after or 8hr before aspirin.
CID3672,Ibuprofen,cardiovascular_disease=true,cvd,1.8,"MI,Stroke,Heart failure",Use lowest dose for shortest time. Consider alternatives.
CID3672,Ibuprofen,hypertension=true,htn,1.4,"BP elevation,Reduced antihypertensive effect",Monitor BP. May need antihypertensive adjustment.
"""

    demo_path = contra_dir / "ibuprofen_demographic_risks.csv"
    with open(demo_path, 'w') as f:
        f.write(demographic_risks)

    print(f"Created: {demo_path}")


def create_drug_interactions_fallback():
    """Create curated drug interactions for Ibuprofen as fallback."""
    print("\n" + "="*60)
    print("Creating Curated Drug Interactions Dataset")
    print("="*60)

    interactions_dir = RAW_DATA_DIR / "interactions"
    interactions_dir.mkdir(parents=True, exist_ok=True)

    # Comprehensive Ibuprofen interactions from clinical sources
    ibuprofen_interactions = """drug_a_id,drug_a_name,drug_b_name,drug_b_class,severity,mechanism,clinical_effect,recommendation
CID3672,Ibuprofen,Warfarin,Anticoagulant,major,Platelet inhibition + anticoagulation,Increased bleeding risk (GI and other),Avoid combination. If necessary monitor INR closely and watch for bleeding.
CID3672,Ibuprofen,Rivaroxaban,Anticoagulant (DOAC),major,Additive bleeding risk,Increased bleeding risk,Avoid combination if possible.
CID3672,Ibuprofen,Apixaban,Anticoagulant (DOAC),major,Additive bleeding risk,Increased bleeding risk,Avoid combination if possible.
CID3672,Ibuprofen,Dabigatran,Anticoagulant (DOAC),major,Additive bleeding risk,Increased bleeding risk,Avoid combination if possible.
CID3672,Ibuprofen,Heparin,Anticoagulant,major,Additive bleeding risk,Increased bleeding risk,Avoid combination.
CID3672,Ibuprofen,Aspirin (>325mg),NSAID/Antiplatelet,major,Additive GI toxicity + reduced aspirin cardioprotection,GI bleeding and reduced MI protection,Avoid combination. If needed take aspirin first.
CID3672,Ibuprofen,Aspirin (low-dose),Antiplatelet,moderate,Competitive COX-1 binding,Reduced cardioprotective effect of aspirin,Take aspirin 30min before or 8hr after ibuprofen.
CID3672,Ibuprofen,Clopidogrel,Antiplatelet,major,Additive bleeding risk,Increased GI bleeding,Avoid if possible. Consider PPI if necessary.
CID3672,Ibuprofen,Prasugrel,Antiplatelet,major,Additive bleeding risk,Increased bleeding,Avoid combination.
CID3672,Ibuprofen,Ticagrelor,Antiplatelet,major,Additive bleeding risk,Increased bleeding,Avoid combination.
CID3672,Ibuprofen,Lithium,Mood Stabilizer,major,Reduced renal lithium clearance,Lithium toxicity,Monitor lithium levels. May need 25-50% dose reduction.
CID3672,Ibuprofen,Methotrexate,Immunosuppressant,major,Reduced MTX clearance,Methotrexate toxicity (bone marrow suppression),Avoid with high-dose MTX. Monitor closely with low-dose.
CID3672,Ibuprofen,Lisinopril,ACE Inhibitor,moderate,Reduced prostaglandin-mediated vasodilation,Reduced antihypertensive effect + increased nephrotoxicity,Monitor BP and renal function.
CID3672,Ibuprofen,Enalapril,ACE Inhibitor,moderate,Reduced prostaglandin-mediated vasodilation,Reduced antihypertensive effect + increased nephrotoxicity,Monitor BP and renal function.
CID3672,Ibuprofen,Ramipril,ACE Inhibitor,moderate,Reduced prostaglandin-mediated vasodilation,Reduced antihypertensive effect + increased nephrotoxicity,Monitor BP and renal function.
CID3672,Ibuprofen,Losartan,ARB,moderate,Reduced prostaglandin-mediated vasodilation,Reduced antihypertensive effect + increased nephrotoxicity,Monitor BP and renal function.
CID3672,Ibuprofen,Valsartan,ARB,moderate,Reduced prostaglandin-mediated vasodilation,Reduced antihypertensive effect + increased nephrotoxicity,Monitor BP and renal function.
CID3672,Ibuprofen,Furosemide,Loop Diuretic,moderate,Reduced prostaglandin-mediated renal blood flow,Reduced diuretic effect + increased nephrotoxicity,Monitor fluid status and renal function.
CID3672,Ibuprofen,Hydrochlorothiazide,Thiazide Diuretic,moderate,Reduced prostaglandin-mediated effects,Reduced diuretic and antihypertensive effect,Monitor BP and electrolytes.
CID3672,Ibuprofen,Spironolactone,K-sparing Diuretic,moderate,Reduced renal function + K retention,Hyperkalemia and reduced diuretic effect,Monitor potassium.
CID3672,Ibuprofen,Digoxin,Cardiac Glycoside,moderate,Reduced renal digoxin clearance,Digoxin toxicity,Monitor digoxin levels.
CID3672,Ibuprofen,Cyclosporine,Immunosuppressant,major,Additive nephrotoxicity,Acute kidney injury,Avoid if possible. Monitor renal function closely.
CID3672,Ibuprofen,Tacrolimus,Immunosuppressant,major,Additive nephrotoxicity,Acute kidney injury,Avoid if possible. Monitor renal function closely.
CID3672,Ibuprofen,SSRIs (Fluoxetine),Antidepressant,moderate,Additive effect on platelet function,Increased GI bleeding risk,Consider PPI co-therapy.
CID3672,Ibuprofen,SSRIs (Sertraline),Antidepressant,moderate,Additive effect on platelet function,Increased GI bleeding risk,Consider PPI co-therapy.
CID3672,Ibuprofen,SNRIs (Venlafaxine),Antidepressant,moderate,Additive effect on platelet function,Increased GI bleeding risk,Consider PPI co-therapy.
CID3672,Ibuprofen,Corticosteroids,Anti-inflammatory,moderate,Additive GI toxicity,Increased GI ulceration and bleeding,Use PPI prophylaxis.
CID3672,Ibuprofen,Quinolones (Ciprofloxacin),Antibiotic,moderate,CNS effects,Increased seizure risk,Caution in patients with seizure history.
CID3672,Ibuprofen,Aminoglycosides,Antibiotic,moderate,Additive nephrotoxicity,Acute kidney injury,Monitor renal function.
CID3672,Ibuprofen,Bisphosphonates,Osteoporosis,moderate,Additive GI irritation,Increased GI ulceration,Take bisphosphonate first. Consider alternative analgesic.
CID3672,Ibuprofen,Phenytoin,Anticonvulsant,minor,Protein binding displacement,Transient increase in free phenytoin,Usually not clinically significant.
CID3672,Ibuprofen,Sulfonylureas,Antidiabetic,minor,Protein binding displacement,Hypoglycemia risk,Monitor blood glucose.
CID3672,Ibuprofen,Alcohol,CNS Depressant,moderate,Additive GI toxicity,Increased GI bleeding risk,Avoid concurrent use especially chronic alcohol use.
CID3672,Ibuprofen,Other NSAIDs (Naproxen),NSAID,major,Additive toxicity without added benefit,Increased GI/renal/CV toxicity,Never combine NSAIDs.
CID3672,Ibuprofen,Other NSAIDs (Diclofenac),NSAID,major,Additive toxicity without added benefit,Increased GI/renal/CV toxicity,Never combine NSAIDs.
CID3672,Ibuprofen,Pemetrexed,Chemotherapy,major,Reduced pemetrexed clearance,Pemetrexed toxicity,Stop ibuprofen 2-5 days before pemetrexed.
CID3672,Ibuprofen,Tenofovir,Antiviral,moderate,Additive nephrotoxicity,Acute kidney injury,Monitor renal function.
CID3672,Ibuprofen,Vancomycin,Antibiotic,moderate,Additive nephrotoxicity,Acute kidney injury,Monitor renal function.
"""

    interactions_path = interactions_dir / "ibuprofen_interactions.csv"
    with open(interactions_path, 'w') as f:
        f.write(ibuprofen_interactions)

    print(f"Created: {interactions_path}")


def main():
    """Run all download and setup tasks."""
    print("="*60)
    print("DRUG SAFETY ENGINE - DATA DOWNLOAD SCRIPT")
    print("="*60)
    print(f"\nData will be saved to: {RAW_DATA_DIR}")

    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Download datasets
    download_sider()
    download_onsides()
    create_ddinter_instructions()

    # Create curated datasets (fallback and enhancement)
    create_contraindications_data()
    create_drug_interactions_fallback()

    print("\n" + "="*60)
    print("DOWNLOAD COMPLETE")
    print("="*60)
    print("\nNext steps:")
    print("1. If DDInter download failed, follow manual instructions in:")
    print(f"   {RAW_DATA_DIR}/ddinter/DOWNLOAD_INSTRUCTIONS.txt")
    print("2. Run the processing script:")
    print("   python scripts/process_ibuprofen.py")


if __name__ == "__main__":
    main()
