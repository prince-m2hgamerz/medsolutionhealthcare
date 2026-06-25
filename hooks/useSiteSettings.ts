"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface SiteSettings {
  site_name: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  hero_title: string;
  hero_subtitle: string;
  about_short: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
}

const DEFAULTS: SiteSettings = {
  site_name: "Asians Healthcare",
  whatsapp_number: "919650928250",
  contact_phone: "+919650928250",
  contact_email: "info@asianshealthcare.com",
  hero_title: "Your Health Journey Starts in India",
  hero_subtitle: "Connect with India's top-rated hospitals and specialist doctors.",
  about_short: "Asians Healthcare is India's premier medical tourism facilitator.",
  facebook_url: "https://facebook.com/asianshealthcare",
  instagram_url: "https://instagram.com/asianshealthcare",
  twitter_url: "https://twitter.com/asianshealthcare",
  youtube_url: "https://youtube.com/@asianshealthcare",
};

const SETTING_KEYS = Object.keys(DEFAULTS);

let cached: SiteSettings | null = null;
let pending: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", SETTING_KEYS);

  if (!data) return DEFAULTS;

  const settings = { ...DEFAULTS };
  for (const row of data) {
    if (row.key in settings) {
      (settings as Record<string, string>)[row.key] = row.value;
    }
  }
  return settings;
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(cached || DEFAULTS);

  useEffect(() => {
    if (cached) return;
    if (!pending) {
      pending = fetchSettings().then((s) => {
        cached = s;
        return s;
      });
    }
    pending.then(setSettings);
  }, []);

  return settings;
}
