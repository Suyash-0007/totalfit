from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel, Field
import random


app = FastAPI(title="TotalFit ML Service", version="0.1.0")


# -------------------------
# Schemas
# -------------------------

class MetricPoint(BaseModel):
	date: str
	steps: Optional[int] = None
	heart_rate: Optional[int] = Field(None, ge=20, le=220)
	calories: Optional[int] = None
	rpe: Optional[float] = Field(None, ge=0, le=10)


class PredictInjuryRequest(BaseModel):
	athlete_id: str
	recent_metrics: List[MetricPoint]


class PredictInjuryResponse(BaseModel):
	athlete_id: str
	injury_risk_percent: float
	risk_level: str
	contributors: List[str]
	recommendations: List[str]


class AnalyzePerformanceRequest(BaseModel):
	athlete_id: str
	metrics: List[MetricPoint]


class AnalyzePerformanceResponse(BaseModel):
	athlete_id: str
	summary: str
	highlights: List[str]
	recommendations: List[str]


class GeneratePlanRequest(BaseModel):
	athlete_id: str
	goal: str
	availability_days: int = Field(ge=1, le=7)
	preferences: Optional[List[str]] = None


class PlanDay(BaseModel):
	day: str
	session: str
	details: str


class CareerRecommendationRequest(BaseModel):
    athlete_id: str
    performance_data: List[MetricPoint]
    current_role: Optional[str] = None
    career_goals: Optional[List[str]] = None


class CareerRecommendation(BaseModel):
    recommendation: str
    category: str
    priority: str
    timeline: str


class CareerRecommendationResponse(BaseModel):
    athlete_id: str
    recommendations: List[CareerRecommendation]
    summary: str


class GeneratePlanResponse(BaseModel):
    athlete_id: str
    goal: str
    weeks: int
    plan: List[PlanDay]


# -------------------------
# Endpoints (mocked logic)
# -------------------------


@app.post("/predict-injury", response_model=PredictInjuryResponse)
def predict_injury(payload: PredictInjuryRequest):
	# Mocked risk: base on recent HR and RPE if present, otherwise random
	hr_values = [p.heart_rate for p in payload.recent_metrics if p.heart_rate]
	rpe_values = [p.rpe for p in payload.recent_metrics if p.rpe is not None]
	avg_hr = sum(hr_values) / len(hr_values) if hr_values else 60
	avg_rpe = sum(rpe_values) / len(rpe_values) if rpe_values else 5.0
	risk = min(95.0, max(3.0, (avg_hr - 50) * 0.6 + avg_rpe * 4 + random.uniform(-5, 5)))
	level = "Low" if risk < 20 else ("Moderate" if risk < 40 else ("Elevated" if risk < 60 else "High"))
	contributors = [
		"Training load variability",
		"Elevated RPE",
		"Sleep debt (mocked)",
	]
	recommendations = [
		"Introduce deload day and mobility work",
		"Monitor morning HRV (mocked)",
		"Increase sleep to 8h for 3 nights",
	]
	return PredictInjuryResponse(
		athlete_id=payload.athlete_id,
		injury_risk_percent=round(risk, 1),
		risk_level=level,
		contributors=contributors,
		recommendations=recommendations,
	)


@app.post("/analyze-performance", response_model=AnalyzePerformanceResponse)
def analyze_performance(payload: AnalyzePerformanceRequest):
	steps = [p.steps for p in payload.metrics if p.steps]
	hr = [p.heart_rate for p in payload.metrics if p.heart_rate]
	cal = [p.calories for p in payload.metrics if p.calories]
	trend_steps = "up" if steps and steps[-1] >= (sum(steps) / len(steps)) else "flat"
	trend_hr = "down" if hr and hr[-1] <= (sum(hr) / len(hr)) else "flat"
	summary = (
		f"Steps trending {trend_steps}, heart rate trending {trend_hr}. Calories avg: "
		+ (f"{int(sum(cal)/len(cal))} kcal" if cal else "n/a")
	)
	highlights = [
		"Best day reached 15k steps (mocked)",
		"Consistent pacing across week (mocked)",
	]
	recommendations = [
		"Add one low-intensity aerobic session",
		"Include 2x strength sessions focusing on posterior chain",
	]
	return AnalyzePerformanceResponse(
		athlete_id=payload.athlete_id,
		summary=summary,
		highlights=highlights,
		recommendations=recommendations,
	)


@app.post("/generate-plan", response_model=GeneratePlanResponse)
def generate_plan(payload: GeneratePlanRequest):
	week_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
	available = week_days[: payload.availability_days]
	plan = []
	for d in available:
		plan.append(
			PlanDay(
				day=d,
				session="Intervals" if d in ("Tue", "Thu") else ("Strength" if d in ("Mon", "Fri") else "Endurance"),
				details=f"Goal: {payload.goal}. RPE 6-7. (mocked)",
			)
		)
	return GeneratePlanResponse(
		athlete_id=payload.athlete_id,
		goal=payload.goal,
		weeks=4,
		plan=plan,
	)


@app.post("/career-recommendations", response_model=CareerRecommendationResponse)
def career_recommendations(payload: CareerRecommendationRequest):
    # Mocked career recommendations based on performance data
    steps_data = [p.steps for p in payload.performance_data if p.steps]
    hr_data = [p.heart_rate for p in payload.performance_data if p.heart_rate]
    
    avg_steps = sum(steps_data) / len(steps_data) if steps_data else 8000
    avg_hr = sum(hr_data) / len(hr_data) if hr_data else 70
    
    # Generate career recommendations based on performance patterns
    recommendations = []
    
    if avg_steps > 10000:
        recommendations.append(CareerRecommendation(
            recommendation="Consider leadership roles or team captaincy given your consistent high activity levels",
            category="leadership",
            priority="high",
            timeline="3-6 months"
        ))
    
    if avg_hr < 65 and len(hr_data) > 5:
        recommendations.append(CareerRecommendation(
            recommendation="Your excellent cardiovascular recovery suggests potential for endurance sports coaching",
            category="coaching",
            priority="medium", 
            timeline="6-12 months"
        ))
    
    if len(payload.performance_data) > 7:
        recommendations.append(CareerRecommendation(
            recommendation="Your consistent training data shows discipline suitable for sports management roles",
            category="management",
            priority="medium",
            timeline="1-2 years"
        ))
    
    # Add some general career recommendations
    recommendations.extend([
        CareerRecommendation(
            recommendation="Develop communication skills through sports psychology courses",
            category="skills",
            priority="low",
            timeline="ongoing"
        ),
        CareerRecommendation(
            recommendation="Network with sports industry professionals at local events",
            category="networking", 
            priority="medium",
            timeline="next 3 months"
        ),
        CareerRecommendation(
            recommendation="Create a sports performance portfolio showcasing your data analysis skills",
            category="portfolio",
            priority="medium",
            timeline="6 months"
        )
    ])
    
    summary = f"Based on {len(payload.performance_data)} performance records, showing {avg_steps:.0f} avg steps and {avg_hr:.0f} avg HR. Strong potential for sports-related career development."
    
    return CareerRecommendationResponse(
        athlete_id=payload.athlete_id,
        recommendations=recommendations,
        summary=summary
    )


# Health check
@app.get("/health")
def health():
    return {"status": "ok"}



