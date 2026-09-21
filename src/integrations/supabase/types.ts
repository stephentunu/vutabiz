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
      disputes: {
        Row: {
          admin_notes: string | null
          against_user_id: string
          created_at: string
          evidence_url: string | null
          id: string
          order_id: string
          raised_by: string
          reason: string
          resolved_at: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          against_user_id: string
          created_at?: string
          evidence_url?: string | null
          id?: string
          order_id: string
          raised_by: string
          reason: string
          resolved_at?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          against_user_id?: string
          created_at?: string
          evidence_url?: string | null
          id?: string
          order_id?: string
          raised_by?: string
          reason?: string
          resolved_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          id: string
          seller_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          id?: string
          seller_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          id?: string
          seller_id?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          ad_expires_at: string | null
          ad_fee_ksh: number
          ad_paid: boolean
          category_id: number | null
          contact_clicks_count: number
          contact_phone: string | null
          county_id: number | null
          created_at: string
          description: string | null
          distance_km: number
          donation_recipient: string | null
          duration_days: number
          education_level: Database["public"]["Enums"]["education_level"] | null
          experience_years: number | null
          id: string
          image_url: string | null
          job_title: string | null
          landmark: string | null
          languages: string[]
          listing_type: Database["public"]["Enums"]["listing_type"]
          offers_delivery: boolean
          payment_methods: string[]
          price: number
          risk: Database["public"]["Enums"]["risk_level"]
          self_description: string | null
          seller_id: string
          specialties: string[]
          status: Database["public"]["Enums"]["listing_status"]
          subcounty_id: number | null
          title: string
          town: string | null
          transport_means: string | null
          updated_at: string
          ward_id: number | null
          work_rate_type: string | null
        }
        Insert: {
          ad_expires_at?: string | null
          ad_fee_ksh?: number
          ad_paid?: boolean
          category_id?: number | null
          contact_clicks_count?: number
          contact_phone?: string | null
          county_id?: number | null
          created_at?: string
          description?: string | null
          distance_km?: number
          donation_recipient?: string | null
          duration_days?: number
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          job_title?: string | null
          landmark?: string | null
          languages?: string[]
          listing_type?: Database["public"]["Enums"]["listing_type"]
          offers_delivery?: boolean
          payment_methods?: string[]
          price: number
          risk?: Database["public"]["Enums"]["risk_level"]
          self_description?: string | null
          seller_id: string
          specialties?: string[]
          status?: Database["public"]["Enums"]["listing_status"]
          subcounty_id?: number | null
          title: string
          town?: string | null
          transport_means?: string | null
          updated_at?: string
          ward_id?: number | null
          work_rate_type?: string | null
        }
        Update: {
          ad_expires_at?: string | null
          ad_fee_ksh?: number
          ad_paid?: boolean
          category_id?: number | null
          contact_clicks_count?: number
          contact_phone?: string | null
          county_id?: number | null
          created_at?: string
          description?: string | null
          distance_km?: number
          donation_recipient?: string | null
          duration_days?: number
          education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          experience_years?: number | null
          id?: string
          image_url?: string | null
          job_title?: string | null
          landmark?: string | null
          languages?: string[]
          listing_type?: Database["public"]["Enums"]["listing_type"]
          offers_delivery?: boolean
          payment_methods?: string[]
          price?: number
          risk?: Database["public"]["Enums"]["risk_level"]
          self_description?: string | null
          seller_id?: string
          specialties?: string[]
          status?: Database["public"]["Enums"]["listing_status"]
          subcounty_id?: number | null
          title?: string
          town?: string | null
          transport_means?: string | null
          updated_at?: string
          ward_id?: number | null
          work_rate_type?: string | null
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
            foreignKeyName: "listings_subcounty_id_fkey"
            columns: ["subcounty_id"]
            isOneToOne: false
            referencedRelation: "subcounties"
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
      orders: {
        Row: {
          amount: number
          buyer_id: string
          courier_partner: string | null
          created_at: string
          delivery_address: string | null
          delivery_fee: number
          delivery_status: string
          escrow_status: string
          id: string
          listing_id: string
          payment_method: string
          payment_ref: string | null
          released_at: string | null
          seller_id: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          courier_partner?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number
          delivery_status?: string
          escrow_status?: string
          id?: string
          listing_id: string
          payment_method?: string
          payment_ref?: string | null
          released_at?: string | null
          seller_id: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          courier_partner?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_fee?: number
          delivery_status?: string
          escrow_status?: string
          id?: string
          listing_id?: string
          payment_method?: string
          payment_ref?: string | null
          released_at?: string | null
          seller_id?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
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
          referral_code: string | null
          referred_by: string | null
          sub_county_id: number | null
          total_referrals_count: number
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
          referral_code?: string | null
          referred_by?: string | null
          sub_county_id?: number | null
          total_referrals_count?: number
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
          referral_code?: string | null
          referred_by?: string | null
          sub_county_id?: number | null
          total_referrals_count?: number
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
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_user_id: string
          referrer_id: string
          reward_amount: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_user_id: string
          referrer_id: string
          reward_amount?: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_user_id?: string
          referrer_id?: string
          reward_amount?: number
          status?: string
        }
        Relationships: []
      }
      subcounties: {
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
            foreignKeyName: "subcounties_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
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
          subcounty_id: number | null
        }
        Insert: {
          county_id: number
          id?: number
          name: string
          subcounty_id?: number | null
        }
        Update: {
          county_id?: number
          id?: number
          name?: string
          subcounty_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wards_county_id_fkey"
            columns: ["county_id"]
            isOneToOne: false
            referencedRelation: "counties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wards_subcounty_id_fkey"
            columns: ["subcounty_id"]
            isOneToOne: false
            referencedRelation: "subcounties"
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
      increment_contact_clicks: {
        Args: { p_listing_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      education_level:
        | "none"
        | "kcpe"
        | "kcse"
        | "certificate"
        | "diploma"
        | "degree"
      listing_status: "active" | "sold" | "deleted"
      listing_type: "sale" | "hire" | "service" | "donation"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      education_level: [
        "none",
        "kcpe",
        "kcse",
        "certificate",
        "diploma",
        "degree",
      ],
      listing_status: ["active", "sold", "deleted"],
      listing_type: ["sale", "hire", "service", "donation"],
      offer_status: ["pending", "accepted", "rejected"],
      risk_level: ["low", "medium", "high"],
    },
  },
} as const
