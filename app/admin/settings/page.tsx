"use client";

import { useEffect, useState } from "react";
import { Save, Server } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { SITE_IMAGE_DEFAULTS, SITE_IMAGE_KEYS, SITE_IMAGE_SLOTS, type SiteImageKey } from "@/lib/site-images";

interface Setting {
  label: string;
  key: string;
  value: string;
}

const defaultSettings: Setting[] = [
  { label: "Site Name", key: "site_name", value: "Med Solution Healthcare" },
  { label: "WhatsApp Number", key: "whatsapp_number", value: "+918285068544" },
  { label: "Contact Phone", key: "contact_phone", value: "+918285068544" },
  { label: "Contact Email", key: "contact_email", value: "info@medsolutionhealthcare.com" },
  { label: "Admin Email", key: "admin_email", value: "admin@medsolutionhealthcare.com" },
  { label: "Hero Title", key: "hero_title", value: "Your Health Journey Starts in India" },
  { label: "Hero Subtitle", key: "hero_subtitle", value: "Connect with India's top-rated hospitals and specialist doctors." },
  { label: "About Short", key: "about_short", value: "Med Solution Healthcare is India's premier medical tourism facilitator." },
  { label: "Facebook URL", key: "facebook_url", value: "https://facebook.com/medsolutionhealthcare" },
  { label: "Instagram URL", key: "instagram_url", value: "https://instagram.com/medsolutionhealthcare" },
  { label: "Twitter URL", key: "twitter_url", value: "https://twitter.com/medsolutionhealthcare" },
  { label: "YouTube URL", key: "youtube_url", value: "https://youtube.com/@medsolutionhealthcare" },
];

const envLabel: Record<string, string> = {
  site_name: "SITE_SETTING_SITE_NAME",
  whatsapp_number: "SITE_SETTING_WHATSAPP_NUMBER",
  contact_phone: "SITE_SETTING_CONTACT_PHONE",
  contact_email: "SITE_SETTING_CONTACT_EMAIL",
  admin_email: "SITE_SETTING_ADMIN_EMAIL",
  facebook_url: "SITE_SETTING_FACEBOOK_URL",
  instagram_url: "SITE_SETTING_INSTAGRAM_URL",
  twitter_url: "SITE_SETTING_TWITTER_URL",
  youtube_url: "SITE_SETTING_YOUTUBE_URL",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [images, setImages] = useState<Record<SiteImageKey, string>>(SITE_IMAGE_DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [envOverrides, setEnvOverrides] = useState<string[]>([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings").then((res) => res.json()).then((data) => {
      if (data && data.data && data.data.length > 0) {
        const merged = defaultSettings.map((s) => {
          const found = data.data.find((d: Record<string, unknown>) => d.key === s.key);
          return found ? { ...s, value: found.value as string } : s;
        });
        setSettings(merged);

        setImages((current) => {
          const next = { ...current };
          data.data.forEach((item: Record<string, unknown>) => {
            if (typeof item.key === "string" && item.key in SITE_IMAGE_DEFAULTS && typeof item.value === "string") {
              next[item.key as SiteImageKey] = item.value;
            }
          });
          return next;
        });
      }
      if (data.envOverrides) {
        setEnvOverrides(data.envOverrides);
      }
    });

    fetch("/api/admin/profile").then((res) => res.json()).then((data) => {
      if (data && data.role) {
        setUserRole(data.role);
      }
    });
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings((current) => current.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const updateImage = (key: SiteImageKey, value: string) => {
    setImages((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        ...settings.map((setting) => ({ key: setting.key, value: setting.value })),
        ...Object.entries(images).map(([key, value]) => ({ key, value })),
      ]),
    });

    setSaving(false);

    if (!res.ok) {
      const { error } = await res.json();
      setError(error ?? "Failed to save settings");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const envOverriddenSet = new Set(envOverrides);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-text">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
          <Save size={16} /> <span className="hidden sm:inline">{saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-body-md mb-6">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-aloe-10/20 border border-aloe-10 text-text rounded-md px-4 py-3 text-body-md mb-6">
          Settings saved successfully!
        </div>
      )}

      {userRole === "super_admin" && envOverrides.length > 0 && (
        <div className="bg-surface rounded-lg border border-amber-200 p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Server size={18} className="text-amber-600" />
            <h2 className="font-display text-heading-md text-text">System Config — Environment Overrides</h2>
          </div>
          <p className="text-body-md text-text-muted mb-4">
            These settings are controlled by environment variables. The values below are read-only and override any database values.
          </p>
          <div className="space-y-2">
            {envOverrides.map((key) => (
              <div key={key} className="flex items-center justify-between rounded-md bg-amber-50/50 px-4 py-2.5">
                <span className="text-body-md font-medium text-text capitalize">{key.replace(/_/g, " ")}</span>
                <code className="rounded bg-amber-100 px-2.5 py-0.5 text-caption font-mono text-amber-800">
                  {envLabel[key] || `SITE_SETTING_${key.toUpperCase()}`}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settings.map((setting) => {
          const isEnvOverridden = envOverriddenSet.has(setting.key);
          return (
            <div key={setting.key} className={`bg-surface rounded-lg border p-5 ${isEnvOverridden ? "border-amber-200" : "border-border"}`}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-caption text-text-light uppercase tracking-wider">
                  {setting.label}
                </label>
                {isEnvOverridden && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-caption font-medium text-amber-700">
                    <Server size={12} /> Env
                  </span>
                )}
              </div>
              <input
                type="text"
                value={setting.value}
                onChange={(e) => updateSetting(setting.key, e.target.value)}
                disabled={isEnvOverridden}
                className="w-full border border-border rounded-md px-4 py-2.5 text-body-md text-text focus:outline-none focus:border-border-focus transition-colors disabled:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="mb-5">
          <p className="text-caption text-text-muted">Supabase Storage</p>
          <h2 className="font-display text-heading-lg text-text">Editable Site Images</h2>
          <p className="mt-1 max-w-3xl text-body-md text-text-muted">
            Upload, replace, or remove the main page and section images. Files are stored in the
            <span className="font-medium text-text"> site-images </span>
            Supabase bucket and saved as site settings.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SITE_IMAGE_SLOTS.map((slot) => (
            <ImageUploadField
              key={slot.key}
              label={`${slot.page}: ${slot.label}`}
              value={images[slot.key]}
              onChange={(value) => updateImage(slot.key, value)}
              folder={slot.folder}
              helper={slot.helper}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
