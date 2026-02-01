#!/usr/bin/env python3
"""
Hyper-Personalized Drug Risk Engine for Ibuprofen

This engine calculates personalized risk scores based on:
- User demographics (age, sex, pregnancy status)
- Medical history (conditions, allergies)
- Current medications (drug-drug interactions)
- Lifestyle factors (alcohol, smoking)
- Lab values (renal function, etc.)
"""

import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum


class RiskLevel(Enum):
    SAFE = "safe"
    CAUTION = "caution"
    WARNING = "warning"
    DANGER = "danger"
    CONTRAINDICATED = "contraindicated"


@dataclass
class UserProfile:
    """User health profile for personalized risk assessment."""
    # Demographics
    age: int = 30
    sex: str = "unknown"  # male, female, unknown
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None

    # Pregnancy/Lactation
    pregnant: bool = False
    pregnancy_trimester: Optional[int] = None  # 1, 2, or 3
    breastfeeding: bool = False

    # Medical History - Conditions (ICD-10 codes or plain text)
    conditions: list = field(default_factory=list)

    # Current Medications
    current_medications: list = field(default_factory=list)

    # Allergies
    allergies: list = field(default_factory=list)

    # Lifestyle
    smoker: bool = False
    alcohol_use: str = "none"  # none, light, moderate, heavy

    # Lab Values
    egfr: Optional[float] = None  # Kidney function (mL/min/1.73m2)
    creatinine: Optional[float] = None
    inr: Optional[float] = None  # If on warfarin
    platelets: Optional[int] = None

    # History
    history_gi_bleed: bool = False
    history_mi: bool = False
    history_stroke: bool = False


@dataclass
class RiskAssessment:
    """Result of risk assessment."""
    overall_risk_level: RiskLevel
    risk_score: int  # 0-100
    can_take: bool
    hard_stops: list
    warnings: list
    cautions: list
    personalized_side_effects: list
    recommended_max_dose: Optional[str]
    recommended_duration: Optional[str]
    monitoring_required: list
    alternatives_to_consider: list
    detailed_breakdown: dict


class IbuprofenRiskEngine:
    """Hyper-personalized risk engine for Ibuprofen."""

    def __init__(self, data_path: Optional[Path] = None):
        """Initialize with processed drug data."""
        if data_path is None:
            data_path = Path(__file__).parent.parent / "data" / "processed" / "ibuprofen_unified.json"

        self.drug_data = self._load_data(data_path)
        self._build_lookup_tables()

    def _load_data(self, path: Path) -> dict:
        """Load processed drug data."""
        if path.exists():
            with open(path) as f:
                return json.load(f)
        else:
            # Return minimal structure if data not yet processed
            return {
                "contraindications": [],
                "demographic_risks": [],
                "drug_interactions": [],
                "side_effects": [],
                "boxed_warnings": []
            }

    def _build_lookup_tables(self):
        """Build fast lookup tables for assessments."""
        # ICD-10 to contraindication mapping
        self.contraindication_map = {}
        for contra in self.drug_data.get("contraindications", []):
            code = contra.get("icd10_code", "").upper()
            condition = contra.get("condition", "").lower()
            self.contraindication_map[code] = contra
            self.contraindication_map[condition] = contra

        # Medication to interaction mapping
        self.interaction_map = {}
        for interaction in self.drug_data.get("drug_interactions", []):
            drug_name = interaction.get("interacting_drug", "").lower()
            self.interaction_map[drug_name] = interaction

        # Demographic risk lookup
        self.demographic_risks = self.drug_data.get("demographic_risks", [])

    def assess_risk(self, user: UserProfile) -> RiskAssessment:
        """
        Perform comprehensive personalized risk assessment.

        Returns detailed risk assessment with:
        - Overall risk level and score
        - Hard stops (contraindications)
        - Warnings and cautions
        - Personalized side effect risks
        - Dosing recommendations
        - Monitoring requirements
        """
        hard_stops = []
        warnings = []
        cautions = []
        risk_score = 0
        monitoring = []
        breakdown = {
            "contraindication_score": 0,
            "interaction_score": 0,
            "demographic_score": 0,
            "condition_score": 0,
            "factors": []
        }

        # ============================================
        # PHASE 1: HARD STOPS (Absolute Contraindications)
        # ============================================

        # Check pregnancy (3rd trimester)
        if user.pregnant and user.pregnancy_trimester == 3:
            hard_stops.append({
                "type": "absolute_contraindication",
                "reason": "Third trimester pregnancy",
                "detail": "NSAIDs contraindicated after 30 weeks gestation due to risk of premature ductus arteriosus closure and oligohydramnios",
                "severity": "critical"
            })
            breakdown["contraindication_score"] = 100

        # Check NSAID/Aspirin allergy
        nsaid_allergy_terms = ["nsaid", "ibuprofen", "aspirin", "naproxen", "diclofenac", "advil", "motrin"]
        for allergy in user.allergies:
            if any(term in allergy.lower() for term in nsaid_allergy_terms):
                hard_stops.append({
                    "type": "allergy",
                    "reason": f"Documented allergy: {allergy}",
                    "detail": "Risk of severe allergic reaction including anaphylaxis",
                    "severity": "critical"
                })
                breakdown["contraindication_score"] = 100

        # Check conditions against contraindications
        for condition in user.conditions:
            condition_lower = condition.lower()
            condition_upper = condition.upper()

            # Check both ICD-10 code and text
            contra = self.contraindication_map.get(condition_upper) or \
                     self.contraindication_map.get(condition_lower)

            if contra:
                if contra["severity"] == "absolute":
                    hard_stops.append({
                        "type": "absolute_contraindication",
                        "reason": contra["condition"],
                        "detail": contra["reason"],
                        "icd10": contra.get("icd10_code"),
                        "severity": "critical"
                    })
                    breakdown["contraindication_score"] = 100
                elif contra["severity"] == "relative":
                    warnings.append({
                        "type": "relative_contraindication",
                        "reason": contra["condition"],
                        "detail": contra["reason"],
                        "severity": "high"
                    })
                    risk_score += 25
                    breakdown["condition_score"] += 25

        # Check severe renal impairment
        if user.egfr is not None and user.egfr < 30:
            hard_stops.append({
                "type": "absolute_contraindication",
                "reason": "Severe renal impairment (eGFR < 30)",
                "detail": "NSAIDs can cause acute kidney injury and further decline in renal function",
                "severity": "critical"
            })
            breakdown["contraindication_score"] = 100

        # ============================================
        # PHASE 2: DRUG-DRUG INTERACTIONS
        # ============================================

        for med in user.current_medications:
            med_lower = med.lower()

            # Direct lookup
            interaction = self.interaction_map.get(med_lower)

            # Fuzzy match if not found
            if not interaction:
                for drug_name, inter in self.interaction_map.items():
                    if drug_name in med_lower or med_lower in drug_name:
                        interaction = inter
                        break

            if interaction:
                severity = interaction.get("severity", "").lower()

                if severity == "major":
                    warnings.append({
                        "type": "drug_interaction",
                        "interacting_drug": med,
                        "severity": "high",
                        "mechanism": interaction.get("mechanism", ""),
                        "effect": interaction.get("clinical_effect", ""),
                        "recommendation": interaction.get("recommendation", "")
                    })
                    risk_score += 30
                    breakdown["interaction_score"] += 30
                    breakdown["factors"].append(f"Major interaction with {med}")

                    # Add monitoring based on interaction
                    if "bleeding" in interaction.get("clinical_effect", "").lower():
                        monitoring.append("Monitor for signs of bleeding")
                    if "renal" in interaction.get("clinical_effect", "").lower():
                        monitoring.append("Monitor renal function")

                elif severity == "moderate":
                    cautions.append({
                        "type": "drug_interaction",
                        "interacting_drug": med,
                        "severity": "moderate",
                        "mechanism": interaction.get("mechanism", ""),
                        "effect": interaction.get("clinical_effect", ""),
                        "recommendation": interaction.get("recommendation", "")
                    })
                    risk_score += 15
                    breakdown["interaction_score"] += 15
                    breakdown["factors"].append(f"Moderate interaction with {med}")

        # ============================================
        # PHASE 3: DEMOGRAPHIC RISK FACTORS
        # ============================================

        # Age-based risks
        if user.age >= 75:
            warnings.append({
                "type": "demographic_risk",
                "factor": "Age >= 75",
                "detail": "Very elderly patients have 3-4x higher risk of GI bleeding and AKI",
                "risk_multiplier": 3.5
            })
            risk_score += 30
            breakdown["demographic_score"] += 30
            breakdown["factors"].append("Very elderly (>=75)")
            monitoring.extend(["Monitor for GI symptoms", "Monitor renal function", "Assess fall risk"])

        elif user.age >= 65:
            warnings.append({
                "type": "demographic_risk",
                "factor": "Age >= 65",
                "detail": "Elderly patients have 2-3x higher risk of GI bleeding",
                "risk_multiplier": 2.5
            })
            risk_score += 20
            breakdown["demographic_score"] += 20
            breakdown["factors"].append("Elderly (>=65)")
            monitoring.append("Monitor for GI symptoms")

        # Pregnancy (1st/2nd trimester - caution)
        if user.pregnant and user.pregnancy_trimester in [1, 2]:
            warnings.append({
                "type": "demographic_risk",
                "factor": f"Pregnancy (trimester {user.pregnancy_trimester})",
                "detail": "Use only if clearly needed. Some studies suggest miscarriage risk in 1st trimester.",
                "risk_multiplier": 1.5
            })
            risk_score += 20
            breakdown["demographic_score"] += 20

        # Breastfeeding
        if user.breastfeeding:
            cautions.append({
                "type": "demographic_risk",
                "factor": "Breastfeeding",
                "detail": "Small amounts pass into breast milk. Generally considered compatible but use lowest dose.",
                "risk_multiplier": 1.1
            })
            risk_score += 5
            breakdown["factors"].append("Breastfeeding")

        # Renal function (moderate impairment)
        if user.egfr is not None and 30 <= user.egfr < 60:
            warnings.append({
                "type": "demographic_risk",
                "factor": f"Moderate renal impairment (eGFR {user.egfr})",
                "detail": "Increased risk of AKI. Use with caution and monitor.",
                "risk_multiplier": 2.0
            })
            risk_score += 20
            breakdown["demographic_score"] += 20
            monitoring.append("Monitor serum creatinine")

        # GI bleed history
        if user.history_gi_bleed:
            warnings.append({
                "type": "history_risk",
                "factor": "History of GI bleeding",
                "detail": "3x increased risk of recurrent GI bleeding",
                "risk_multiplier": 3.0
            })
            risk_score += 25
            breakdown["condition_score"] += 25
            cautions.append({
                "type": "recommendation",
                "detail": "If ibuprofen necessary, co-prescribe PPI for gastroprotection"
            })

        # Cardiovascular history
        if user.history_mi or user.history_stroke:
            warnings.append({
                "type": "history_risk",
                "factor": "History of MI/Stroke",
                "detail": "Increased cardiovascular risk with NSAIDs. Consider alternatives.",
                "risk_multiplier": 1.8
            })
            risk_score += 20
            breakdown["condition_score"] += 20

        # Lifestyle factors
        if user.alcohol_use == "heavy":
            warnings.append({
                "type": "lifestyle_risk",
                "factor": "Heavy alcohol use",
                "detail": "Significantly increased GI bleeding risk",
                "risk_multiplier": 2.0
            })
            risk_score += 20
            breakdown["factors"].append("Heavy alcohol use")

        elif user.alcohol_use == "moderate":
            cautions.append({
                "type": "lifestyle_risk",
                "factor": "Moderate alcohol use",
                "detail": "Increased GI bleeding risk",
                "risk_multiplier": 1.5
            })
            risk_score += 10

        if user.smoker:
            cautions.append({
                "type": "lifestyle_risk",
                "factor": "Smoker",
                "detail": "Increased GI mucosal damage",
                "risk_multiplier": 1.4
            })
            risk_score += 10
            breakdown["factors"].append("Smoker")

        # ============================================
        # PHASE 4: PERSONALIZED SIDE EFFECTS
        # ============================================

        personalized_se = self._calculate_personalized_side_effects(user, breakdown)

        # ============================================
        # PHASE 5: DETERMINE OVERALL RISK LEVEL
        # ============================================

        # Cap risk score at 100
        risk_score = min(risk_score, 100)
        breakdown["total_score"] = risk_score

        # Determine risk level and recommendations
        if hard_stops:
            overall_risk = RiskLevel.CONTRAINDICATED
            can_take = False
            max_dose = None
            duration = None
            alternatives = ["Acetaminophen/Paracetamol (if no liver disease)",
                          "Topical NSAIDs (lower systemic absorption)",
                          "Consult physician for alternatives"]
        elif risk_score >= 70:
            overall_risk = RiskLevel.DANGER
            can_take = False
            max_dose = None
            duration = None
            alternatives = ["Acetaminophen/Paracetamol",
                          "Topical diclofenac gel",
                          "Consult physician"]
        elif risk_score >= 50:
            overall_risk = RiskLevel.WARNING
            can_take = True  # With significant caution
            max_dose = "200mg per dose, max 600mg/day"
            duration = "Maximum 3 days without medical supervision"
            alternatives = ["Acetaminophen may be safer alternative"]
        elif risk_score >= 25:
            overall_risk = RiskLevel.CAUTION
            can_take = True
            max_dose = "400mg per dose, max 1200mg/day"
            duration = "Maximum 5-7 days for self-treatment"
            alternatives = []
        else:
            overall_risk = RiskLevel.SAFE
            can_take = True
            max_dose = "400mg per dose, max 1200mg/day (OTC)"
            duration = "Up to 10 days for pain, 3 days for fever"
            alternatives = []

        # Always recommend lowest effective dose for shortest duration
        if can_take and overall_risk != RiskLevel.SAFE:
            cautions.insert(0, {
                "type": "general_recommendation",
                "detail": "Use the lowest effective dose for the shortest duration necessary"
            })

        return RiskAssessment(
            overall_risk_level=overall_risk,
            risk_score=risk_score,
            can_take=can_take,
            hard_stops=hard_stops,
            warnings=warnings,
            cautions=cautions,
            personalized_side_effects=personalized_se,
            recommended_max_dose=max_dose,
            recommended_duration=duration,
            monitoring_required=list(set(monitoring)),  # Deduplicate
            alternatives_to_consider=alternatives,
            detailed_breakdown=breakdown
        )

    def _calculate_personalized_side_effects(self, user: UserProfile, breakdown: dict) -> list:
        """Calculate personalized side effect risks based on user profile."""
        personalized = []

        base_side_effects = self.drug_data.get("side_effects", [])

        # High-risk side effects to highlight based on user profile
        user_risk_factors = set()

        if user.age >= 65:
            user_risk_factors.update(["gi", "renal", "cardiovascular", "fall", "cognitive"])
        if user.history_gi_bleed:
            user_risk_factors.add("gi")
        if user.egfr and user.egfr < 60:
            user_risk_factors.add("renal")
        if user.history_mi or user.history_stroke:
            user_risk_factors.add("cardiovascular")
        if any("anticoag" in med.lower() or "warfarin" in med.lower()
               for med in user.current_medications):
            user_risk_factors.add("bleeding")

        # GI-related keywords
        gi_keywords = ["gastro", "ulcer", "bleeding", "haemorrhage", "hemorrhage",
                       "perforation", "nausea", "vomit", "dyspepsia", "abdominal"]
        renal_keywords = ["renal", "kidney", "nephro", "creatinine", "oliguria"]
        cv_keywords = ["cardiac", "heart", "infarction", "stroke", "hypertension",
                       "edema", "oedema", "thrombotic"]
        bleeding_keywords = ["bleed", "haemorrhage", "hemorrhage", "purpura", "bruising"]

        for se in base_side_effects:
            se_name_lower = se.get("name", "").lower()
            risk_multiplier = 1.0
            relevant_factors = []

            # Check if side effect matches user's risk factors
            if "gi" in user_risk_factors and any(kw in se_name_lower for kw in gi_keywords):
                risk_multiplier *= 2.5
                relevant_factors.append("GI risk factor")

            if "renal" in user_risk_factors and any(kw in se_name_lower for kw in renal_keywords):
                risk_multiplier *= 2.0
                relevant_factors.append("Renal risk factor")

            if "cardiovascular" in user_risk_factors and any(kw in se_name_lower for kw in cv_keywords):
                risk_multiplier *= 1.8
                relevant_factors.append("CV risk factor")

            if "bleeding" in user_risk_factors and any(kw in se_name_lower for kw in bleeding_keywords):
                risk_multiplier *= 3.0
                relevant_factors.append("On anticoagulant")

            # Only include if relevant to user or severe
            if risk_multiplier > 1.0 or se.get("severity") == "severe":
                base_freq = 0.01  # Default 1% if unknown
                if se.get("frequency") and isinstance(se["frequency"], dict):
                    base_freq = se["frequency"].get("value", 0.01)

                personalized.append({
                    "name": se.get("name"),
                    "base_severity": se.get("severity"),
                    "base_frequency": base_freq,
                    "personalized_frequency": min(base_freq * risk_multiplier, 0.5),
                    "risk_multiplier": risk_multiplier,
                    "relevant_factors": relevant_factors,
                    "personalized_severity": "high" if risk_multiplier > 2.0 else se.get("severity")
                })

        # Sort by personalized frequency (highest risk first)
        personalized.sort(key=lambda x: x["personalized_frequency"], reverse=True)

        return personalized[:15]  # Return top 15 most relevant


def format_assessment_report(assessment: RiskAssessment, user: UserProfile) -> str:
    """Format assessment as readable report."""
    lines = []
    lines.append("=" * 60)
    lines.append("IBUPROFEN PERSONALIZED RISK ASSESSMENT")
    lines.append("=" * 60)

    # User summary
    lines.append(f"\nPatient: {user.age}yo {user.sex}")
    if user.conditions:
        lines.append(f"Conditions: {', '.join(user.conditions[:5])}")
    if user.current_medications:
        lines.append(f"Current Meds: {', '.join(user.current_medications[:5])}")

    # Overall result
    lines.append("\n" + "-" * 40)
    risk_emoji = {
        RiskLevel.SAFE: "[OK]",
        RiskLevel.CAUTION: "[!]",
        RiskLevel.WARNING: "[!!]",
        RiskLevel.DANGER: "[!!!]",
        RiskLevel.CONTRAINDICATED: "[XXX]"
    }

    lines.append(f"RISK LEVEL: {risk_emoji[assessment.overall_risk_level]} "
                f"{assessment.overall_risk_level.value.upper()}")
    lines.append(f"RISK SCORE: {assessment.risk_score}/100")
    lines.append(f"CAN TAKE: {'NO' if not assessment.can_take else 'YES (with precautions)' if assessment.risk_score > 0 else 'YES'}")

    # Hard stops
    if assessment.hard_stops:
        lines.append("\n" + "-" * 40)
        lines.append("CONTRAINDICATIONS (DO NOT TAKE):")
        for stop in assessment.hard_stops:
            lines.append(f"  [X] {stop['reason']}")
            lines.append(f"      {stop['detail']}")

    # Warnings
    if assessment.warnings:
        lines.append("\n" + "-" * 40)
        lines.append("WARNINGS:")
        for warn in assessment.warnings:
            if warn["type"] == "drug_interaction":
                lines.append(f"  [!] Interaction with {warn['interacting_drug']}")
                lines.append(f"      Effect: {warn['effect']}")
                lines.append(f"      Action: {warn['recommendation']}")
            else:
                lines.append(f"  [!] {warn.get('reason') or warn.get('factor')}")
                lines.append(f"      {warn['detail']}")

    # Dosing
    if assessment.can_take:
        lines.append("\n" + "-" * 40)
        lines.append("DOSING RECOMMENDATIONS:")
        lines.append(f"  Max Dose: {assessment.recommended_max_dose}")
        lines.append(f"  Duration: {assessment.recommended_duration}")

    # Monitoring
    if assessment.monitoring_required:
        lines.append("\n" + "-" * 40)
        lines.append("MONITORING REQUIRED:")
        for mon in assessment.monitoring_required:
            lines.append(f"  - {mon}")

    # Top personalized side effects
    if assessment.personalized_side_effects:
        lines.append("\n" + "-" * 40)
        lines.append("YOUR HIGHEST-RISK SIDE EFFECTS:")
        for se in assessment.personalized_side_effects[:5]:
            pct = se['personalized_frequency'] * 100
            lines.append(f"  - {se['name']}: {pct:.1f}% risk "
                        f"({se['risk_multiplier']:.1f}x your baseline)")
            if se['relevant_factors']:
                lines.append(f"    Due to: {', '.join(se['relevant_factors'])}")

    # Alternatives
    if assessment.alternatives_to_consider:
        lines.append("\n" + "-" * 40)
        lines.append("CONSIDER ALTERNATIVES:")
        for alt in assessment.alternatives_to_consider:
            lines.append(f"  - {alt}")

    lines.append("\n" + "=" * 60)
    lines.append("DISCLAIMER: This is for informational purposes only.")
    lines.append("Always consult a healthcare provider before taking medication.")
    lines.append("=" * 60)

    return "\n".join(lines)


# ============================================
# EXAMPLE USAGE
# ============================================

if __name__ == "__main__":
    # Initialize engine
    engine = IbuprofenRiskEngine()

    # Example 1: Low-risk patient
    print("\n\nEXAMPLE 1: LOW-RISK PATIENT")
    user1 = UserProfile(
        age=35,
        sex="male",
        conditions=[],
        current_medications=["Vitamin D"],
        allergies=[],
        egfr=95
    )
    assessment1 = engine.assess_risk(user1)
    print(format_assessment_report(assessment1, user1))

    # Example 2: Elderly patient on blood thinners
    print("\n\nEXAMPLE 2: HIGH-RISK ELDERLY PATIENT")
    user2 = UserProfile(
        age=72,
        sex="female",
        conditions=["Hypertension", "Atrial Fibrillation"],
        current_medications=["Warfarin", "Lisinopril", "Metoprolol"],
        allergies=[],
        history_gi_bleed=True,
        egfr=55
    )
    assessment2 = engine.assess_risk(user2)
    print(format_assessment_report(assessment2, user2))

    # Example 3: Pregnant woman (3rd trimester)
    print("\n\nEXAMPLE 3: CONTRAINDICATED - PREGNANCY")
    user3 = UserProfile(
        age=28,
        sex="female",
        pregnant=True,
        pregnancy_trimester=3,
        conditions=[],
        current_medications=["Prenatal vitamins"],
        allergies=[]
    )
    assessment3 = engine.assess_risk(user3)
    print(format_assessment_report(assessment3, user3))

    # Example 4: Patient with NSAID allergy
    print("\n\nEXAMPLE 4: CONTRAINDICATED - ALLERGY")
    user4 = UserProfile(
        age=45,
        sex="male",
        conditions=[],
        current_medications=[],
        allergies=["Aspirin - hives", "NSAIDs"]
    )
    assessment4 = engine.assess_risk(user4)
    print(format_assessment_report(assessment4, user4))
