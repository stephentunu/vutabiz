export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          icon: string | null
          id: number
          name: string
          parent_id: number | null
          slug: string
        }
        Insert: {
          icon?: string | null
          id?: number
          name: string
          parent_id?: number | null
          slug: string
        }
        Update: {
          icon?: string | null
          id?: number
          name?: string
          parent_id?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      counties: {
        Row: {
          code: number
          id: number
          name: string
        }
        Insert: {
          code: number
          id: number
          name: string
        }
        Update: {
          code?: number
          id?: number
          name?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          ad_expires_at: string | null
          ad_fee_ksh: number
          ad_paid: boolean
          category_id: number | null
          county_id: number | null
          created_at: string
          description: string | null
          distance_km: number
          duration_days: number
          id: string
          image_url: string | null
          price: number
          risk: Database["public"]["Enums"]["risk_level"]
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          town: string | null
          updated_at: string
          ward_id: number | null
        }
        Insert: {
          ad_expires_at?: string | null
          ad_fee_ksh?: number
          ad_paid?: boolean
          category_id?: number | null
          county_id?: number | null
          created_at?: string
          description?: string | null
          distance_km?: number
          duration_days?: number
          id?: string
          image_url?: string | null
          price: number
          risk?: Database["public"]["Enums"]["risk_level"]
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          town?: string | null
          updated_at?: string
          ward_id?: number | null
        }
        Update: {
          ad_expires_at?: string | null
          ad_fee_ksh?: number
          ad_paid?: boolean
          category_id?: number | null
          county_id?: number | null
          created_at?: string
          description?: string | null
          distance_km?: number
          duration_days?: number
          id?: string
          image_url?: string | null
          price?: number
          risk?: Database["public"]["Enums"]["risk_level"]
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          town?: string | null
          updated_at?: string
          ward_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          id: string
          listing_id: string
          message: string | null
          status: Database["public"]["Enums"]["offer_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          listing_id: string | null
          method: string
          mpesa_ref: string | null
          purpose: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          listing_id?: string | null
          method?: string
          mpesa_ref?: string | null
          purpose?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          listing_id?: string | null
          method?: string
          mpesa_ref?: string | null
          purpose?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          building: string | null
          county_id: number | null
          created_at: string
          email: string
          full_name: string
          id: string
          market_share: number
          phone: string
          town: string | null
          updated_at: string
          ward_id: number | null
        }
        Insert: {
          avatar_url?: string | null
          building?: string | null
          county_id?: number | null
          created_at?: string
          email: string
          full_name: string
          id: string
          market_share?: number
          phone?: string
          town?: string | null
          updated_at?: string
          ward_id?: number | null
        }
        Update: {
          avatar_url?: string | null
          building?: string | null
          county_id?: number | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          market_share?: number
          phone?: string
          town?: string | null
          updated_at?: string
          ward_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wards: {
        Row: {
          county_id: number
          id: number
          name: string
        }
        Insert: {
          county_id: number
          id?: number
          name: string
        }
        Update: {
          county_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "wards_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calc_ad_fee: {
        Args: {
          _county_id: number
          _distance_km: number
          _duration_days: number
          _market_share: number
          _price: number
          _risk: Database["public"]["Enums"]["risk_level"]
        }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      listing_status: "active" | "sold" | "deleted"
      offer_status: "pending" | "accepted" | "rejected"
      risk_level: "low" | "medium" | "high"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      listing_status: ["active", "sold", "deleted"],
      offer_status: ["pending", "accepted", "rejected"],
      risk_level: ["low", "medium", "high"],
    },
  },
} as const
