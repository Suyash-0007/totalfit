import { NextRequest, NextResponse } from 'next/server';
import mlService, { MetricPoint } from '@/lib/services/mlService';

/**
 * API endpoint to get AI-powered recommendations based on user data
 * 
 * @param request - The incoming request with user data
 * @returns NextResponse with recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userData } = body;
    
    if (!userId || !userData) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and userData' },
        { status: 400 }
      );
    }

    // Format user data for the ML service
    const metricPoint: MetricPoint = mlService.formatUserDataToMetricPoint(userData);
    
    // Get performance analysis from ML service
    const performanceAnalysis = await mlService.analyzePerformance(
      userId,
      [metricPoint]
    );

    // Get injury risk prediction if we have enough data
    const injuryRisk = await mlService.predictInjuryRisk(
      userId,
      [metricPoint]
    );

    // Get career recommendations based on performance data
    const careerRecommendations = await mlService.getCareerRecommendations(
      userId,
      [metricPoint]
    );

    // Combine recommendations from all analyses
    const combinedRecommendations = [
      ...performanceAnalysis.recommendations,
      ...injuryRisk.recommendations,
      ...careerRecommendations.recommendations.map(cr => cr.recommendation)
    ];

    // Format the response
    const response = {
      userId,
      summary: performanceAnalysis.summary,
      highlights: performanceAnalysis.highlights,
      recommendations: combinedRecommendations,
      injuryRisk: {
        percent: injuryRisk.injury_risk_percent,
        level: injuryRisk.risk_level,
        contributors: injuryRisk.contributors
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to get a training plan based on user goals
 * 
 * @param request - The incoming request with user goals
 * @returns NextResponse with training plan
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goal, availabilityDays, preferences } = body;
    
    if (!userId || !goal || !availabilityDays) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, goal, and availabilityDays' },
        { status: 400 }
      );
    }

    // Generate training plan
    const plan = await mlService.generatePlan(
      userId,
      goal,
      availabilityDays,
      preferences
    );

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error generating training plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate training plan' },
      { status: 500 }
    );
  }
}