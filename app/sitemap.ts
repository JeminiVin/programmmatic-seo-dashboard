import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://your-domain.vercel.app"; // Apna live Vercel URL yahan daal dena

  // Supabase se saare dynamic slugs fetch karo
  const { data: rows } = await supabase.from("rowData").select("slug, created_at");

  const dynamicRoutes = (rows || []).map((row) => ({
    url: `${baseUrl}/cities/${row.slug}`,
    lastModified: row.created_at ? new Date(row.created_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Static routes + Dynamic pSEO routes
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...dynamicRoutes,
  ];
}