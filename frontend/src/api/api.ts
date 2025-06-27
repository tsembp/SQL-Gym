export interface Challenge {
  id: number;
  title: string;
  prompt: string;
  difficulty: string;
  hints: string[];
  example_data: any[];
}

export interface EvalRequest {
  challenge_id: number;
  user_answer: string;
}

export interface EvalResponse {
  success: boolean;
  message?: string;
  error?: string;
  preview?: any[];
  user_columns?: string[];
}

export interface TableSchema {
  [tableName: string]: {
    columns: {
      name: string;
      type: string;
      nullable: boolean;
    }[];
  };
}

export interface Solution {
  solution_sql: string;
  expected_columns: string[];
}