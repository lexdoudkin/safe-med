#!/usr/bin/env python3
"""
SafeMed Backend API
FastAPI server exposing the multi-drug risk assessment engine.
"""

import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.multi_drug_engine import DrugRiskEngine, UserProfile, RiskLevel

# Initialize FastAPI app
app = FastAPI(
    title="SafeMed API",
    description="Hyper-personalized multi-drug risk assessment API",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize multi-drug risk engine
engine = DrugRiskEngine()


# ============================================
# Request/Response Models
# ============================================

class UserProfileRequest(BaseModel):
    """User health profile for risk assessment."""
    age: int = Field(default=30, ge=0, le=120)
    sex: str = Field(default="unknown", pattern="^(male|female|unknown)$")
    weight_kg: Optional[float] = None
    pregnant: bool = False
    pregnancy_trimester: Optional[int] = Field(default=None, ge=1, le=3)
    breastfeeding: bool = False
    conditions: list[str] = []
    current_medications: list[str] = []
    allergies: list[str] = []
    smoker: bool = False
    alcohol_use: str = Field(default="none", pattern="^(none|light|moderate|heavy)$")
    egfr: Optional[float] = None
    potassium: Optional[float] = None
    heart_rate: Optional[int] = None
    history_gi_bleed: bool = False
    history_mi: bool = False
    history_stroke: bool = False
    history_arrhythmia: bool = False
    history_seizures: bool = False


class RiskAssessmentResponse(BaseModel):
    """Risk assessment result."""
    drug_name: str
    overall_risk_level: str
    risk_score: int
    can_take: bool
    hard_stops: list[dict]
    warnings: list[dict]
    cautions: list[dict]
    personalized_side_effects: list[dict]
    recommended_max_dose: Optional[str]
    monitoring_required: list[str]
    alternatives_to_consider: list[str]
    detailed_breakdown: dict


class AssessRiskRequest(BaseModel):
    """Request for drug risk assessment."""
    drug_name: str = Field(..., description="Name of the drug to assess (e.g., 'ibuprofen', 'salbutamol')")
    profile: UserProfileRequest


class QuickCheckRequest(BaseModel):
    """Simplified request for quick risk check."""
    drug_name: str = Field(..., description="Name of the drug to check")
    age: int = Field(default=30, ge=0, le=120)
    medications: list[str] = []
    conditions: list[str] = []
    pregnant: bool = False


class QuickCheckResponse(BaseModel):
    """Simplified response for quick risk check."""
    drug_name: str
    can_take: bool
    risk_level: str
    risk_score: int
    hard_stops: list[str]
    top_warnings: list[str]


# ============================================
# API Endpoints
# ============================================

@app.get("/health")
async def health_check():
    """Health check endpoint for Cloud Run."""
    return {"status": "healthy"}


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "SafeMed API",
        "version": "2.0.0",
        "available_drugs": engine.get_available_drugs(),
        "endpoints": {
            "health": "/health",
            "drugs": "/api/v1/drugs",
            "assess_risk": "/api/v1/assess",
            "quick_check": "/api/v1/quick-check"
        }
    }


@app.get("/api/v1/drugs")
async def list_drugs():
    """List all available drugs supported by the risk engine."""
    drugs = engine.get_available_drugs()
    return {
        "drugs": drugs,
        "count": len(drugs)
    }


@app.post("/api/v1/assess", response_model=RiskAssessmentResponse)
async def assess_risk(request: AssessRiskRequest):
    """
    Perform comprehensive personalized risk assessment for a specific drug.

    Returns detailed risk assessment including:
    - Overall risk level and score
    - Hard stops (contraindications)
    - Warnings and cautions
    - Personalized side effect risks
    - Dosing recommendations
    - Monitoring requirements
    """
    # Normalize drug name
    drug_name = request.drug_name.lower().strip()
    available_drugs = engine.get_available_drugs()

    # Check if drug is supported
    if drug_name not in available_drugs:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "drug_not_supported",
                "message": f"Drug '{request.drug_name}' is not supported",
                "available_drugs": available_drugs
            }
        )

    try:
        profile = request.profile
        # Convert request to UserProfile
        user = UserProfile(
            age=profile.age,
            sex=profile.sex,
            weight_kg=profile.weight_kg,
            pregnant=profile.pregnant,
            pregnancy_trimester=profile.pregnancy_trimester,
            breastfeeding=profile.breastfeeding,
            conditions=profile.conditions,
            current_medications=profile.current_medications,
            allergies=profile.allergies,
            smoker=profile.smoker,
            alcohol_use=profile.alcohol_use,
            egfr=profile.egfr,
            history_gi_bleed=profile.history_gi_bleed,
            history_mi=profile.history_mi,
            history_stroke=profile.history_stroke
        )

        # Perform assessment for specific drug
        result = engine.assess_risk(drug_name, user)

        return RiskAssessmentResponse(
            drug_name=result.drug_name,
            overall_risk_level=result.overall_risk_level.value,
            risk_score=result.risk_score,
            can_take=result.can_take,
            hard_stops=result.hard_stops,
            warnings=result.warnings,
            cautions=result.cautions,
            personalized_side_effects=result.personalized_side_effects,
            recommended_max_dose=result.recommended_max_dose,
            monitoring_required=result.monitoring_required,
            alternatives_to_consider=result.alternatives_to_consider,
            detailed_breakdown=result.detailed_breakdown
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/quick-check", response_model=QuickCheckResponse)
async def quick_check(request: QuickCheckRequest):
    """
    Quick risk assessment with minimal input.

    Returns simplified risk assessment for rapid checks.
    """
    # Normalize drug name
    drug_name = request.drug_name.lower().strip()
    available_drugs = engine.get_available_drugs()

    if drug_name not in available_drugs:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "drug_not_supported",
                "message": f"Drug '{request.drug_name}' is not supported",
                "available_drugs": available_drugs
            }
        )

    try:
        user = UserProfile(
            age=request.age,
            current_medications=request.medications,
            conditions=request.conditions,
            pregnant=request.pregnant,
            pregnancy_trimester=3 if request.pregnant else None
        )

        result = engine.assess_risk(drug_name, user)

        return QuickCheckResponse(
            drug_name=result.drug_name,
            can_take=result.can_take,
            risk_level=result.overall_risk_level.value,
            risk_score=result.risk_score,
            hard_stops=[h["reason"] for h in result.hard_stops],
            top_warnings=[w.get("reason") or w.get("factor") or "Unknown warning" for w in result.warnings[:3] if w.get("reason") or w.get("factor")]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/drug-info/{drug_name}")
async def get_drug_info(drug_name: str):
    """
    Get information about a specific drug in the database.

    Returns statistics about available data.
    """
    drug_name = drug_name.lower().strip()
    available_drugs = engine.get_available_drugs()

    if drug_name not in available_drugs:
        raise HTTPException(
            status_code=404,
            detail={
                "error": "drug_not_supported",
                "message": f"Drug '{drug_name}' is not supported",
                "available_drugs": available_drugs
            }
        )

    drug_data = engine.drug_data.get(drug_name, {})

    return {
        "drug": drug_data.get("drug_name", drug_name),
        "drug_class": drug_data.get("drug_class", "Unknown"),
        "alternate_names": drug_data.get("alternate_names", []),
        "data_summary": {
            "total_side_effects": len(drug_data.get("side_effects", [])),
            "total_interactions": len(drug_data.get("drug_interactions", [])),
            "total_contraindications": len(drug_data.get("contraindications", [])),
            "boxed_warnings": len(drug_data.get("boxed_warnings", []))
        },
        "major_interactions": [
            i["interacting_drug"]
            for i in drug_data.get("drug_interactions", [])
            if i.get("severity") == "major"
        ][:10],
        "absolute_contraindications": [
            c["condition"]
            for c in drug_data.get("contraindications", [])
            if c.get("severity") == "absolute"
        ]
    }


# ============================================
# Run with Uvicorn
# ============================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
