export type FormAnswers = {
  father_name: string;
  daughter_name: string;
  partner_name: string;
  email: string;
  profession?: string;
  three_words?: string;
  memory_quality?: string;
  memory_scene?: string;
  partner_observation?: string;
  tone: "traditional" | "warm-witty" | "emotional";
  length: "2min" | "4min" | "6min";
  avoid?: string;
  end_line?: string;
  speaker_feeling?: string;
  thread?: string;
  surprise?: string;
  relationship?: string;
  what_shed_say?: string;
  unsaid?: string;
  partner_timeline?: string;
};

export type Archetype =
  | "traditionalist"
  | "storyteller"
  | "warm-wit"
  | "heart-on-sleeve";

export type Generation = {
  id: string;
  archetype: Archetype;
  output: string;
  created_at: string;
};

export type OrderStatus = "pending" | "paid" | "generated" | "failed";
