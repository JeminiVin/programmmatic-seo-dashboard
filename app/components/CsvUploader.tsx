"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";

type CityData = {
  slug?: string;
  cityName?: string;
  city?: string;
  service?: string;
  title?: string;
  description?: string;
};

type Props = {
  onDataLoaded: (data: CityData[]) => void;
};

export default function CsvUploader({ onDataLoaded }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Supabase Database me data insert karne ka function
  // Supabase Database me data insert karne ka function
  const handleCSVUpload = async (parsedData: CityData[]) => {
    try {
      setIsUploading(true);

      // Supabase 'rowdata' table ke schema ke hisab se format kar rahe hain
      const rowsToInsert = parsedData.map((row) => {
        const city = row.cityName || row.city || "Unknown City";
        const generatedSlug =
          row.slug || city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        return {
          slug: generatedSlug,
          city_name: city,
          service_name: row.service || "General Service",
          custom_title: row.title || `Best Services in ${city}`,
          custom_description: row.description || `Top rated services in ${city}`,
        };
      });

      // Yahan parsedData ki jagah rowsToInsert pass karna hai
      const { error } = await supabase.from("rowdata").insert(rowsToInsert);

      if (error) {
        console.error("Error inserting data into Supabase:", error.message);
        alert(`Failed to save data to Supabase: ${error.message}`);
      } else {
        alert("CSV data successfully saved to Supabase database!");
        onDataLoaded(rowsToInsert);
        setIsOpen(false);
        setFileName(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong during database upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse<CityData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.data && results.data.length > 0) {
          await handleCSVUpload(results.data);
        } else {
          alert("CSV file appears to be empty or improperly formatted.");
        }
      },
      error: (error) => {
        console.error("PapaParse Error:", error);
        alert("Error reading CSV file.");
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition shadow-md flex items-center gap-2"
      >
        <span>📥</span> Upload CSV Data
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Upload CSV to Supabase
              </h3>
              <button
                onClick={() => !isUploading && setIsOpen(false)}
                disabled={isUploading}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Upload a <code className="text-indigo-600 font-mono">.csv</code> file.
              Supported columns: <code className="text-indigo-600 font-mono">slug, cityName, service, title, description</code>.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-500 transition cursor-pointer bg-slate-50 relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-3xl block mb-2">
                {isUploading ? "⏳" : "📁"}
              </span>
              <span className="text-xs font-semibold text-slate-700 block">
                {isUploading
                  ? "Saving to Database..."
                  : fileName
                  ? fileName
                  : "Click or drag CSV file here"}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                CSV files up to 10MB
              </span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}