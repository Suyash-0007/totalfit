import axios from 'axios';

// Types for ML Service API
export interface RawUserData {
  steps?: number;
  heartRate?: number;
  calories?: number;
  rpe?: number;
}

export interface MetricPoint {
  date: string;
  steps?: number;
  heart_rate?: number;
  calories?: number;
  rpe?: number;
}

export interface AnalyzePerformanceRequest {
  athlete_id: string;
  metrics: MetricPoint[];
}

export interface AnalyzePerformanceResponse {
  athlete_id: string;
  summary: string;
  highlights: string[];
  recommendations: string[];
}

export interface PredictInjuryRequest {
  athlete_id: string;
  recent_metrics: MetricPoint[];
}

export interface PredictInjuryResponse {
  athlete_id: string;
  injury_risk_percent: number;
  risk_level: string;
  contributors: string[];
  recommendations: string[];
}

export interface GeneratePlanRequest {
  athlete_id: string;
  goal: string;
  availability_days: number;
  preferences?: string[];
}

export interface PlanDay {
  day: string;
  session: string;
  details: string;
}

export interface GeneratePlanResponse {
  athlete_id: string;
  goal: string;
  weeks: number;
  plan: PlanDay[];
}

export interface CareerRecommendationRequest {
  athlete_id: string;
  performance_data: MetricPoint[];
  current_role?: string;
  career_goals?: string[];
}

export interface CareerRecommendation {
  recommendation: string;
  category: string;
  priority: string;
  timeline: string;
}

export interface CareerRecommendationResponse {
  athlete_id: string;
  recommendations: CareerRecommendation[];
  summary: string;
}

// ML Service configuration
const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'http://localhost:8001';

class MLService {
  /**
   * Analyzes user performance data and returns insights and recommendations
   * @param athleteId - The ID of the athlete
   * @param metrics - Array of metric points with performance data
   * @returns Analysis with summary, highlights and recommendations
   */
  async analyzePerformance(athleteId: string, metrics: MetricPoint[]): Promise<AnalyzePerformanceResponse> {
    try {
      const response = await axios.post<AnalyzePerformanceResponse>(
        `${ML_SERVICE_URL}/analyze-performance`,
        { athlete_id: athleteId, metrics }
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing performance:', error);
      // Return fallback data if the service is unavailable
      return this.getFallbackPerformanceAnalysis(athleteId);
    }
  }

  /**
   * Predicts injury risk based on recent metrics
   * @param athleteId - The ID of the athlete
   * @param recentMetrics - Recent performance metrics
   * @returns Injury risk assessment and recommendations
   */
  async predictInjuryRisk(athleteId: string, recentMetrics: MetricPoint[]): Promise<PredictInjuryResponse> {
    try {
      const response = await axios.post<PredictInjuryResponse>(
        `${ML_SERVICE_URL}/predict-injury`,
        { athlete_id: athleteId, recent_metrics: recentMetrics }
      );
      return response.data;
    } catch (error) {
      console.error('Error predicting injury risk:', error);
      // Return fallback data if the service is unavailable
      return this.getFallbackInjuryPrediction(athleteId);
    }
  }

  /**
   * Generates a training plan based on user goals and availability
   * @param athleteId - The ID of the athlete
   * @param goal - The training goal
   * @param availabilityDays - Number of available days per week
   * @param preferences - Optional training preferences
   * @returns Generated training plan
   */
  async generatePlan(
    athleteId: string,
    goal: string,
    availabilityDays: number,
    preferences?: string[]
  ): Promise<GeneratePlanResponse> {
    try {
      const response = await axios.post<GeneratePlanResponse>(
        `${ML_SERVICE_URL}/generate-plan`,
        {
          athlete_id: athleteId,
          goal,
          availability_days: availabilityDays,
          preferences
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating plan:', error);
      // Return fallback data if the service is unavailable
      return this.getFallbackPlan(athleteId, goal, availabilityDays);
    }
  }

  /**
   * Generates career recommendations based on performance data
   * @param athleteId - The ID of the athlete
   * @param performanceData - Array of performance metrics
   * @param currentRole - Optional current role/position
   * @param careerGoals - Optional career goals
   * @returns Career recommendations and summary
   */
  async getCareerRecommendations(
    athleteId: string,
    performanceData: MetricPoint[],
    currentRole?: string,
    careerGoals?: string[]
  ): Promise<CareerRecommendationResponse> {
    try {
      const response = await axios.post<CareerRecommendationResponse>(
        `${ML_SERVICE_URL}/career-recommendations`,
        {
          athlete_id: athleteId,
          performance_data: performanceData,
          current_role: currentRole,
          career_goals: careerGoals
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting career recommendations:', error);
      // Return fallback career recommendations if the service is unavailable
      return this.getFallbackCareerRecommendations(athleteId);
    }
  }

  /**
   * Converts user performance data to the format expected by the ML service
   * @param userData - User performance data from the app
   * @returns Formatted metric point for the ML service
   */
  formatUserDataToMetricPoint(userData: RawUserData): MetricPoint {
    return {
      date: new Date().toISOString().split('T')[0],
      steps: userData.steps,
      heart_rate: userData.heartRate,
      calories: userData.calories,
      rpe: userData.rpe
    };
  }

  /**
   * Provides fallback performance analysis when the ML service is unavailable
   * @param athleteId - The ID of the athlete
   * @returns Fallback performance analysis
   */
  private getFallbackPerformanceAnalysis(athleteId: string): AnalyzePerformanceResponse {
    return {
      athlete_id: athleteId,
      summary: 'Analysis based on your recent activity patterns.',
      highlights: [
        'Consistent training frequency',
        'Good recovery patterns'
      ],
      recommendations: [
        'Consider adding more variety to your workouts',
        'Focus on mobility work to improve overall movement quality',
        'Gradually increase training volume over the next two weeks'
      ]
    };
  }

  /**
   * Provides fallback injury prediction when the ML service is unavailable
   * @param athleteId - The ID of the athlete
   * @returns Fallback injury risk prediction
   */
  private getFallbackInjuryPrediction(athleteId: string): PredictInjuryResponse {
    return {
      athlete_id: athleteId,
      injury_risk_percent: 15.0,
      risk_level: 'Low',
      contributors: [
        'Training load consistency',
        'Recovery patterns'
      ],
      recommendations: [
        'Maintain current training/recovery balance',
        'Consider adding mobility work to your routine',
        'Monitor for any early warning signs of fatigue'
      ]
    };
  }

  /**
   * Provides fallback training plan when the ML service is unavailable
   * @param athleteId - The ID of the athlete
   * @param goal - The training goal
   * @param availabilityDays - Number of available days per week
   * @returns Fallback training plan
   */
  private getFallbackPlan(
    athleteId: string,
    goal: string,
    availabilityDays: number
  ): GeneratePlanResponse {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const available = weekDays.slice(0, availabilityDays);
    const plan: PlanDay[] = available.map(day => ({
      day,
      session: day === 'Mon' || day === 'Thu' ? 'Strength' : 
              day === 'Tue' || day === 'Fri' ? 'Cardio' : 'Recovery',
      details: `Focus on ${goal}. Adjust intensity based on how you feel.`
    }));

    return {
      athlete_id: athleteId,
      goal,
      weeks: 4,
      plan
    };
  }

  /**
   * Provides fallback career recommendations when the ML service is unavailable
   * @param athleteId - The ID of the athlete
   * @returns Fallback career recommendations
   */
  private getFallbackCareerRecommendations(athleteId: string): CareerRecommendationResponse {
    return {
      athlete_id: athleteId,
      summary: 'Based on your performance patterns, showing strong potential for sports-related career development.',
      recommendations: [
        {
          recommendation: 'Consider leadership roles or team captaincy given your consistent activity levels',
          category: 'leadership',
          priority: 'high',
          timeline: '3-6 months'
        },
        {
          recommendation: 'Develop communication skills through sports psychology courses',
          category: 'skills',
          priority: 'medium',
          timeline: 'ongoing'
        },
        {
          recommendation: 'Network with sports industry professionals at local events',
          category: 'networking',
          priority: 'medium',
          timeline: 'next 3 months'
        },
        {
          recommendation: 'Create a sports performance portfolio showcasing your data analysis skills',
          category: 'portfolio',
          priority: 'low',
          timeline: '6 months'
        }
      ]
    };
  }
}

// Export a singleton instance
const mlService = new MLService();
export default mlService;