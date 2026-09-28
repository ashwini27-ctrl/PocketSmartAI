export type PlanType = 'home' | 'party' | 'jewelry';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface RecommendedItem {
  id: string;
  name: string;
  category: string;
  estimatedPrice: number;
  quantity: number;
  totalPrice: number;
  reason: string;
  shoppingLinks: {
    google: string;
    amazon: string;
    flipkart: string;
  };
}

export interface BudgetBreakdownCategory {
  category: string;
  allocatedBudget: number;
  percentageOfBudget: number;
  items: RecommendedItem[];
}

export interface PlanResult {
  id: string;
  userId: string;
  planType: PlanType;
  title: string;
  summary: string;
  totalBudget: number;
  budgetUsed: number;
  budgetRemaining: number;
  budgetBreakdown: BudgetBreakdownCategory[];
  tips: string[];
  requestData: Record<string, any>;
  createdAt: string;
}

export interface HomePlannerInput {
  totalBudget: number;
  room: string;
  homeType: string;
  requiredItems: string[];
  stylePreference: string;
  priority: string;
  additionalRequirements?: string;
}

export interface PartyPlannerInput {
  totalBudget: number;
  partyType: string;
  numberOfGuests: number;
  location: string;
  foodPreference: string;
  decorationPreference: string;
  entertainmentPreference: string;
  date?: string;
  additionalRequirements?: string;
}

export interface JewelryPlannerInput {
  totalBudget: number;
  jewelryType: string;
  occasion: string;
  preferredMetal: string;
  style: string;
  mainPiece: string;
  matchingRequirements?: string;
  additionalRequirements?: string;
}
