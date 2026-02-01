#!/usr/bin/env python3
"""
Multi-Drug Risk Engine - Supports any drug in the registry.
"""

import json
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional, Dict
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
    age: int = 30
    sex: str = "unknown"
    weight_kg: Optional[float] = None

    # Pregnancy/Lactation
    pregnant: bool = False
    pregnancy_trimester: Optional[int] = None
    breastfeeding: bool = False

    # Medical conditions (ICD-10 codes or plain text)
    conditions: list = field(default_factory=list)

    # Current medications
    current_medications: list = field(default_factory=list)

    # Allergies
    allergies: list = field(default_factory=list)

    # Lifestyle
    smoker: bool = False
    alcohol_use: str = "none"

    # Lab values
    egfr: Optional[float] = None
    potassium: Optional[float] = None  # Important for salbutamol
    heart_rate: Optional[int] = None

    # History
    history_gi_bleed: bool = False
    history_mi: bool = False
    history_stroke: bool = False
    history_arrhythmia: bool = False
    history_seizures: bool = False


@dataclass
class RiskAssessment:
    """Result of risk assessment."""
    drug_name: str
    overall_risk_level: RiskLevel
    risk_score: int
    can_take: bool
    hard_stops: list
    warnings: list
    cautions: list
    personalized_side_effects: list
    recommended_max_dose: Optional[str]
    monitoring_required: list
    alternatives_to_consider: list
    detailed_breakdown: dict


class DrugRiskEngine:
    """Multi-drug personalized risk engine."""

    # Drug-specific risk configurations
    DRUG_CONFIGS = {
        "ibuprofen": {
            "risk_keywords": {
                "gi": ["gastro", "ulcer", "bleeding", "haemorrhage", "hemorrhage", "nausea", "vomit", "dyspepsia"],
                "renal": ["renal", "kidney", "nephro", "creatinine", "oliguria"],
                "cv": ["cardiac", "heart", "infarction", "stroke", "hypertension", "edema"],
                "bleeding": ["bleed", "haemorrhage", "hemorrhage", "purpura", "bruising"]
            },
            "risk_multipliers": {
                "gi": 2.5,
                "renal": 2.0,
                "cv": 1.8,
                "bleeding": 3.0
            },
            "user_risk_conditions": {
                "age>=65": ["gi", "renal", "cv"],
                "history_gi_bleed": ["gi", "bleeding"],
                "egfr<60": ["renal"],
                "history_mi": ["cv"],
                "on_anticoagulant": ["bleeding"]
            },
            "allergy_terms": ["nsaid", "ibuprofen", "aspirin", "naproxen", "diclofenac", "advil", "motrin"],
            "dosing": {
                "safe": "400mg per dose, max 1200mg/day (OTC)",
                "caution": "400mg per dose, max 1200mg/day with monitoring",
                "warning": "200mg per dose, max 600mg/day"
            }
        },
        "salbutamol": {
            "risk_keywords": {
                "cv": ["tachycardia", "palpitation", "arrhythmia", "cardiac", "heart", "hypertension"],
                "metabolic": ["hypokalemia", "hypokalaemia", "hyperglycemia", "glucose"],
                "neuro": ["tremor", "headache", "dizziness", "anxiety", "insomnia", "seizure"],
                "respiratory": ["bronchospasm", "paradoxical", "wheez"]
            },
            "risk_multipliers": {
                "cv": 2.0,
                "metabolic": 1.8,
                "neuro": 1.5,
                "respiratory": 2.5
            },
            "user_risk_conditions": {
                "age>=65": ["cv", "metabolic"],
                "cardiovascular_disease": ["cv"],
                "diabetes": ["metabolic"],
                "history_arrhythmia": ["cv"],
                "on_diuretic": ["metabolic"],
                "hyperthyroid": ["cv", "neuro"]
            },
            "allergy_terms": ["salbutamol", "albuterol", "beta-agonist", "ventolin", "proventil"],
            "dosing": {
                "safe": "100-200mcg (1-2 puffs) every 4-6 hours as needed",
                "caution": "100mcg (1 puff) every 4-6 hours. Max 800mcg/day",
                "warning": "Use only under medical supervision"
            }
        }
    }

    def __init__(self, data_dir: Optional[Path] = None):
        """Initialize with processed drug data directory."""
        if data_dir is None:
            data_dir = Path(__file__).parent.parent / "data" / "processed"

        self.data_dir = data_dir
        self.drug_data: Dict[str, dict] = {}
        self._load_all_drugs()

    def _load_all_drugs(self):
        """Load all available drug data."""
        for json_file in self.data_dir.glob("*_unified.json"):
            drug_name = json_file.stem.replace("_unified", "").lower()
            with open(json_file) as f:
                self.drug_data[drug_name] = json.load(f)
            print(f"Loaded: {drug_name}")

    def _build_lookup_tables(self, drug_name: str) -> tuple:
        """Build lookup tables for a specific drug."""
        data = self.drug_data.get(drug_name.lower(), {})

        contra_map = {}
        for contra in data.get("contraindications", []):
            code = contra.get("icd10_code", "").upper()
            condition = contra.get("condition", "").lower()
            contra_map[code] = contra
            contra_map[condition] = contra

        interaction_map = {}
        for interaction in data.get("drug_interactions", []):
            drug = interaction.get("interacting_drug", "").lower()
            interaction_map[drug] = interaction

        return contra_map, interaction_map

    def get_available_drugs(self) -> list:
        """Get list of available drugs."""
        return list(self.drug_data.keys())

    def assess_risk(self, drug_name: str, user: UserProfile) -> RiskAssessment:
        """Assess risk for a specific drug and user profile."""
        drug_name = drug_name.lower()

        if drug_name not in self.drug_data:
            raise ValueError(f"Drug '{drug_name}' not loaded. Available: {self.get_available_drugs()}")

        drug_data = self.drug_data[drug_name]
        config = self.DRUG_CONFIGS.get(drug_name, self.DRUG_CONFIGS["ibuprofen"])  # Default config

        contra_map, interaction_map = self._build_lookup_tables(drug_name)

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

        # ========== PHASE 1: HARD STOPS ==========

        # Check allergies
        for allergy in user.allergies:
            if any(term in allergy.lower() for term in config["allergy_terms"]):
                hard_stops.append({
                    "type": "allergy",
                    "reason": f"Documented allergy: {allergy}",
                    "detail": "Risk of severe allergic reaction",
                    "severity": "critical"
                })
                breakdown["contraindication_score"] = 100

        # Check conditions
        for condition in user.conditions:
            contra = contra_map.get(condition.upper()) or contra_map.get(condition.lower())
            if contra:
                if contra["severity"] == "absolute":
                    hard_stops.append({
                        "type": "absolute_contraindication",
                        "reason": contra["condition"],
                        "detail": contra["reason"],
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

        # Drug-specific hard stops
        if drug_name == "ibuprofen":
            if user.pregnant and user.pregnancy_trimester == 3:
                hard_stops.append({
                    "type": "absolute_contraindication",
                    "reason": "Third trimester pregnancy",
                    "detail": "NSAIDs contraindicated after 30 weeks gestation",
                    "severity": "critical"
                })
            if user.egfr is not None and user.egfr < 30:
                hard_stops.append({
                    "type": "absolute_contraindication",
                    "reason": f"Severe renal impairment (eGFR {user.egfr})",
                    "detail": "High risk of acute kidney injury",
                    "severity": "critical"
                })

        elif drug_name == "salbutamol":
            if user.history_arrhythmia and "tachyarrhythmia" in str(user.conditions).lower():
                hard_stops.append({
                    "type": "absolute_contraindication",
                    "reason": "Tachyarrhythmia",
                    "detail": "Beta-agonists can worsen tachyarrhythmias",
                    "severity": "critical"
                })

        # ========== PHASE 2: DRUG INTERACTIONS ==========

        for med in user.current_medications:
            med_lower = med.lower()
            interaction = interaction_map.get(med_lower)

            if not interaction:
                for drug, inter in interaction_map.items():
                    if drug in med_lower or med_lower in drug:
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
                    breakdown["factors"].append(f"Major interaction: {med}")

                    # Add specific monitoring
                    effect = interaction.get("clinical_effect", "").lower()
                    if "bleeding" in effect:
                        monitoring.append("Monitor for bleeding")
                    if "potassium" in effect or "hypokalemia" in effect:
                        monitoring.append("Monitor potassium levels")
                    if "arrhythmia" in effect:
                        monitoring.append("Monitor ECG/heart rhythm")

                elif severity == "moderate":
                    cautions.append({
                        "type": "drug_interaction",
                        "interacting_drug": med,
                        "severity": "moderate",
                        "effect": interaction.get("clinical_effect", ""),
                        "recommendation": interaction.get("recommendation", "")
                    })
                    risk_score += 15
                    breakdown["interaction_score"] += 15

        # ========== PHASE 3: DEMOGRAPHIC RISKS ==========

        if user.age >= 75:
            risk_score += 25
            breakdown["demographic_score"] += 25
            warnings.append({
                "type": "demographic_risk",
                "factor": "Age >= 75",
                "detail": f"Very elderly patients have increased sensitivity to {drug_data['drug_name']}",
                "risk_multiplier": 2.5
            })
        elif user.age >= 65:
            risk_score += 15
            breakdown["demographic_score"] += 15
            cautions.append({
                "type": "demographic_risk",
                "factor": "Age >= 65",
                "detail": "Elderly patients may need dose adjustment",
                "risk_multiplier": 1.8
            })

        # Drug-specific demographics
        if drug_name == "ibuprofen":
            if user.history_gi_bleed:
                risk_score += 25
                warnings.append({"type": "history", "factor": "GI bleed history", "detail": "3x higher risk"})
            if user.egfr and 30 <= user.egfr < 60:
                risk_score += 20
                monitoring.append("Monitor renal function")

        elif drug_name == "salbutamol":
            if user.history_arrhythmia:
                risk_score += 25
                warnings.append({"type": "history", "factor": "Arrhythmia history", "detail": "Monitor heart rhythm"})
                monitoring.append("Monitor heart rate and rhythm")
            if user.potassium and user.potassium < 3.5:
                risk_score += 20
                warnings.append({"type": "lab", "factor": f"Low potassium ({user.potassium})", "detail": "Risk of worsening"})
                monitoring.append("Monitor potassium")
            if "diabetes" in str(user.conditions).lower():
                risk_score += 10
                monitoring.append("Monitor blood glucose")

        # ========== PHASE 4: PERSONALIZED SIDE EFFECTS ==========

        personalized_se = self._calculate_personalized_side_effects(drug_name, user, config)

        # ========== PHASE 5: DETERMINE RISK LEVEL ==========

        risk_score = min(risk_score, 100)
        breakdown["total_score"] = risk_score

        if hard_stops:
            overall_risk = RiskLevel.CONTRAINDICATED
            can_take = False
            max_dose = None
            alternatives = self._get_alternatives(drug_name)
        elif risk_score >= 70:
            overall_risk = RiskLevel.DANGER
            can_take = False
            max_dose = None
            alternatives = self._get_alternatives(drug_name)
        elif risk_score >= 50:
            overall_risk = RiskLevel.WARNING
            can_take = True
            max_dose = config["dosing"].get("warning")
            alternatives = []
        elif risk_score >= 25:
            overall_risk = RiskLevel.CAUTION
            can_take = True
            max_dose = config["dosing"].get("caution")
            alternatives = []
        else:
            overall_risk = RiskLevel.SAFE
            can_take = True
            max_dose = config["dosing"].get("safe")
            alternatives = []

        return RiskAssessment(
            drug_name=drug_data["drug_name"],
            overall_risk_level=overall_risk,
            risk_score=risk_score,
            can_take=can_take,
            hard_stops=hard_stops,
            warnings=warnings,
            cautions=cautions,
            personalized_side_effects=personalized_se,
            recommended_max_dose=max_dose,
            monitoring_required=list(set(monitoring)),
            alternatives_to_consider=alternatives,
            detailed_breakdown=breakdown
        )

    def _calculate_personalized_side_effects(self, drug_name: str, user: UserProfile, config: dict) -> list:
        """Calculate personalized side effect risks."""
        personalized = []
        drug_data = self.drug_data.get(drug_name, {})
        base_side_effects = drug_data.get("side_effects", [])

        # Determine user's risk categories
        user_risks = set()

        if user.age >= 65:
            for risk in config.get("user_risk_conditions", {}).get("age>=65", []):
                user_risks.add(risk)

        if user.history_gi_bleed:
            for risk in config.get("user_risk_conditions", {}).get("history_gi_bleed", []):
                user_risks.add(risk)

        if user.history_arrhythmia:
            user_risks.add("cv")

        if user.egfr and user.egfr < 60:
            user_risks.add("renal")

        if any("diuretic" in med.lower() or "furosemide" in med.lower() for med in user.current_medications):
            user_risks.add("metabolic")

        # Score each side effect
        risk_keywords = config.get("risk_keywords", {})
        risk_multipliers = config.get("risk_multipliers", {})

        for se in base_side_effects:
            se_name_lower = se.get("name", "").lower()
            multiplier = 1.0
            factors = []

            for risk_type, keywords in risk_keywords.items():
                if risk_type in user_risks and any(kw in se_name_lower for kw in keywords):
                    mult = risk_multipliers.get(risk_type, 1.5)
                    multiplier *= mult
                    factors.append(f"{risk_type.upper()} risk")

            if multiplier > 1.0 or se.get("severity") == "severe":
                base_freq = 0.01
                if se.get("frequency") and isinstance(se["frequency"], dict):
                    base_freq = se["frequency"].get("value", 0.01)

                personalized.append({
                    "name": se.get("name"),
                    "base_severity": se.get("severity"),
                    "personalized_frequency": min(base_freq * multiplier, 0.5),
                    "risk_multiplier": multiplier,
                    "relevant_factors": factors
                })

        personalized.sort(key=lambda x: x["personalized_frequency"], reverse=True)
        return personalized[:10]

    def _get_alternatives(self, drug_name: str) -> list:
        """Get alternative drugs."""
        alternatives = {
            "ibuprofen": [
                "Acetaminophen/Paracetamol (if no liver disease)",
                "Topical NSAIDs (diclofenac gel)",
                "Consult physician for prescription alternatives"
            ],
            "salbutamol": [
                "Ipratropium bromide (anticholinergic)",
                "Inhaled corticosteroids for maintenance",
                "Consult physician for alternatives"
            ]
        }
        return alternatives.get(drug_name, ["Consult physician"])


def format_assessment(assessment: RiskAssessment, user: UserProfile) -> str:
    """Format assessment as readable report."""
    lines = []
    lines.append("=" * 60)
    lines.append(f"{assessment.drug_name.upper()} - PERSONALIZED RISK ASSESSMENT")
    lines.append("=" * 60)

    lines.append(f"\nPatient: {user.age}yo {user.sex}")
    if user.conditions:
        lines.append(f"Conditions: {', '.join(user.conditions[:5])}")
    if user.current_medications:
        lines.append(f"Medications: {', '.join(user.current_medications[:5])}")

    risk_icons = {
        RiskLevel.SAFE: "[OK]",
        RiskLevel.CAUTION: "[!]",
        RiskLevel.WARNING: "[!!]",
        RiskLevel.DANGER: "[!!!]",
        RiskLevel.CONTRAINDICATED: "[XXX]"
    }

    lines.append("\n" + "-" * 40)
    lines.append(f"RISK LEVEL: {risk_icons[assessment.overall_risk_level]} {assessment.overall_risk_level.value.upper()}")
    lines.append(f"RISK SCORE: {assessment.risk_score}/100")
    lines.append(f"CAN TAKE: {'NO' if not assessment.can_take else 'YES'}")

    if assessment.hard_stops:
        lines.append("\n" + "-" * 40)
        lines.append("CONTRAINDICATIONS:")
        for stop in assessment.hard_stops:
            lines.append(f"  [X] {stop['reason']}: {stop['detail']}")

    if assessment.warnings:
        lines.append("\n" + "-" * 40)
        lines.append("WARNINGS:")
        for w in assessment.warnings:
            if w["type"] == "drug_interaction":
                lines.append(f"  [!] {w['interacting_drug']}: {w.get('effect', '')}")
            else:
                lines.append(f"  [!] {w.get('reason') or w.get('factor')}: {w.get('detail', '')}")

    if assessment.can_take and assessment.recommended_max_dose:
        lines.append("\n" + "-" * 40)
        lines.append(f"DOSING: {assessment.recommended_max_dose}")

    if assessment.monitoring_required:
        lines.append("\n" + "-" * 40)
        lines.append("MONITORING:")
        for m in assessment.monitoring_required:
            lines.append(f"  - {m}")

    if assessment.personalized_side_effects:
        lines.append("\n" + "-" * 40)
        lines.append("TOP SIDE EFFECTS FOR YOU:")
        for se in assessment.personalized_side_effects[:5]:
            pct = se['personalized_frequency'] * 100
            lines.append(f"  - {se['name']}: {pct:.1f}% ({se['risk_multiplier']:.1f}x baseline)")

    if assessment.alternatives_to_consider:
        lines.append("\n" + "-" * 40)
        lines.append("ALTERNATIVES:")
        for alt in assessment.alternatives_to_consider:
            lines.append(f"  - {alt}")

    lines.append("\n" + "=" * 60)
    return "\n".join(lines)


# ============================================
# EXAMPLE USAGE
# ============================================

if __name__ == "__main__":
    engine = DrugRiskEngine()

    print(f"\nAvailable drugs: {engine.get_available_drugs()}")

    # Test patient
    user = UserProfile(
        age=68,
        sex="male",
        conditions=["Asthma", "Hypertension", "Type 2 Diabetes"],
        current_medications=["Metformin", "Lisinopril", "Furosemide"],
        history_arrhythmia=False,
        egfr=70
    )

    print("\n" + "=" * 60)
    print("TESTING SAME PATIENT WITH DIFFERENT DRUGS")
    print("=" * 60)

    # Test Ibuprofen
    if "ibuprofen" in engine.get_available_drugs():
        result = engine.assess_risk("ibuprofen", user)
        print(format_assessment(result, user))

    # Test Salbutamol
    if "salbutamol" in engine.get_available_drugs():
        result = engine.assess_risk("salbutamol", user)
        print(format_assessment(result, user))
