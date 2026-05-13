/**
 * Supabase 데이터베이스 타입 정의
 * @supabase/supabase-js v2 GenericSchema 호환 형식
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type FairyMood = "happy" | "neutral" | "worried" | "critical";
export type ModelType = "lstm" | "xgboost" | "lightgbm";
export type RetrainingStatus = "running" | "completed" | "failed";

export type PanelType = "monocrystalline" | "polycrystalline" | "thin-film";

export interface Database {
  public: {
    Tables: {
      facilities: {
        Row: {
          id: string;
          owner_name: string;
          latitude: number;
          longitude: number;
          address: string | null;
          capacity_kw: number;
          panel_type: PanelType;
          installed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_name: string;
          latitude: number;
          longitude: number;
          address?: string | null;
          capacity_kw: number;
          panel_type?: PanelType;
          installed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_name?: string;
          latitude?: number;
          longitude?: number;
          address?: string | null;
          capacity_kw?: number;
          panel_type?: PanelType;
          installed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      power_records: {
        Row: {
          id: string;
          facility_id: string;
          record_date: string;
          actual_kwh: number[];
          predicted_kwh: number[];
          incentive_krw: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          facility_id: string;
          record_date: string;
          actual_kwh: number[];
          predicted_kwh: number[];
          incentive_krw?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          facility_id?: string;
          record_date?: string;
          actual_kwh?: number[];
          predicted_kwh?: number[];
          incentive_krw?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      grid_status: {
        Row: {
          id: string;
          total_error_rate: number;
          fairy_mood: FairyMood;
          active_facilities: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          total_error_rate: number;
          fairy_mood: FairyMood;
          active_facilities?: number;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          total_error_rate?: number;
          fairy_mood?: FairyMood;
          active_facilities?: number;
          recorded_at?: string;
        };
        Relationships: [];
      };
      maintenance_logs: {
        Row: {
          id: string;
          facility_id: string;
          maintenance_date: string;
          maintenance_type: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          facility_id: string;
          maintenance_date: string;
          maintenance_type: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          facility_id?: string;
          maintenance_date?: string;
          maintenance_type?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      model_selections: {
        Row: {
          id: string;
          facility_id: string;
          model_type: ModelType;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          facility_id: string;
          model_type: ModelType;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          facility_id?: string;
          model_type?: ModelType;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      retraining_history: {
        Row: {
          id: string;
          facility_id: string;
          model_type: string;
          trigger_reason: string | null;
          before_mape: number | null;
          after_mape: number | null;
          status: RetrainingStatus;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          facility_id: string;
          model_type: string;
          trigger_reason?: string | null;
          before_mape?: number | null;
          after_mape?: number | null;
          status?: RetrainingStatus;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          facility_id?: string;
          model_type?: string;
          trigger_reason?: string | null;
          before_mape?: number | null;
          after_mape?: number | null;
          status?: RetrainingStatus;
          started_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      fairy_mood: FairyMood;
      model_type: ModelType;
      retraining_status: RetrainingStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

// 편의 타입 alias
export type Facility = Database["public"]["Tables"]["facilities"]["Row"];
export type PowerRecord = Database["public"]["Tables"]["power_records"]["Row"];
export type GridStatus = Database["public"]["Tables"]["grid_status"]["Row"];
export type MaintenanceLog = Database["public"]["Tables"]["maintenance_logs"]["Row"];
export type ModelSelection = Database["public"]["Tables"]["model_selections"]["Row"];
export type RetrainingHistory = Database["public"]["Tables"]["retraining_history"]["Row"];
