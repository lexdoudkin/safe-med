#!/usr/bin/env python3
"""
Example usage of the Ibuprofen Risk Engine.
Run: python example_usage.py
"""

from src.risk_engine import IbuprofenRiskEngine, UserProfile, format_assessment_report

# Initialize the engine (loads processed data)
engine = IbuprofenRiskEngine()


# ============================================
# EXAMPLE 1: Simple check for a healthy adult
# ============================================
print("\n" + "="*60)
print("EXAMPLE 1: Healthy 30-year-old")
print("="*60)

user = UserProfile(age=30)
result = engine.assess_risk(user)

print(f"Can take Ibuprofen: {result.can_take}")
print(f"Risk Score: {result.risk_score}/100")
print(f"Max Dose: {result.recommended_max_dose}")


# ============================================
# EXAMPLE 2: Check with specific medications
# ============================================
print("\n" + "="*60)
print("EXAMPLE 2: Patient on blood pressure meds")
print("="*60)

user = UserProfile(
    age=55,
    current_medications=["Lisinopril", "Hydrochlorothiazide"]
)
result = engine.assess_risk(user)

print(f"Can take Ibuprofen: {result.can_take}")
print(f"Risk Score: {result.risk_score}/100")
print(f"Risk Level: {result.overall_risk_level.value}")

if result.warnings:
    print("\nWarnings:")
    for w in result.warnings:
        if w["type"] == "drug_interaction":
            print(f"  - Interaction with {w['interacting_drug']}: {w['effect']}")


# ============================================
# EXAMPLE 3: Full assessment with detailed profile
# ============================================
print("\n" + "="*60)
print("EXAMPLE 3: Complex patient (full report)")
print("="*60)

user = UserProfile(
    age=68,
    sex="female",
    conditions=["Hypertension", "Type 2 Diabetes"],
    current_medications=["Metformin", "Lisinopril", "Aspirin"],
    allergies=[],
    history_gi_bleed=False,
    egfr=65,  # Mild kidney impairment
    alcohol_use="light",
    smoker=False
)

result = engine.assess_risk(user)
print(format_assessment_report(result, user))


# ============================================
# EXAMPLE 4: Quick risk check function
# ============================================
print("\n" + "="*60)
print("EXAMPLE 4: Quick check function")
print("="*60)

def quick_check(age, medications=None, conditions=None, pregnant=False):
    """Quick risk assessment."""
    user = UserProfile(
        age=age,
        current_medications=medications or [],
        conditions=conditions or [],
        pregnant=pregnant,
        pregnancy_trimester=3 if pregnant else None
    )
    result = engine.assess_risk(user)

    return {
        "can_take": result.can_take,
        "risk_level": result.overall_risk_level.value,
        "risk_score": result.risk_score,
        "hard_stops": [h["reason"] for h in result.hard_stops],
        "top_warnings": [w.get("reason") or w.get("factor") for w in result.warnings[:3]]
    }

# Test quick checks
print("45yo on Warfarin:", quick_check(45, medications=["Warfarin"]))
print("25yo pregnant:", quick_check(25, pregnant=True))
print("35yo healthy:", quick_check(35))


# ============================================
# EXAMPLE 5: Get specific data
# ============================================
print("\n" + "="*60)
print("EXAMPLE 5: Access underlying data")
print("="*60)

# Access the processed drug data directly
print(f"Total side effects in database: {len(engine.drug_data['side_effects'])}")
print(f"Total interactions tracked: {len(engine.drug_data['drug_interactions'])}")
print(f"Boxed warnings: {len(engine.drug_data['boxed_warnings'])}")

# Get all major interactions
major_interactions = [
    i["interacting_drug"]
    for i in engine.drug_data["drug_interactions"]
    if i["severity"] == "major"
]
print(f"\nMajor interactions with: {', '.join(major_interactions[:10])}...")

# Get absolute contraindications
absolute = [
    c["condition"]
    for c in engine.drug_data["contraindications"]
    if c["severity"] == "absolute"
]
print(f"\nAbsolute contraindications: {', '.join(absolute)}")
