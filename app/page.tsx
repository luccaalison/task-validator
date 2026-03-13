"use client";

import { useState, useCallback } from "react";
import FileUploader from "@/components/FileUploader";
import RubricsInput from "@/components/RubricsInput";
import Tutorial from "@/components/Tutorial";
import ValidationReport from "@/components/ValidationReport";
import { extractZip } from "@/lib/extract";
import { runAllValidators } from "@/lib/validators";
import type { ValidatorOutput, FileMap } from "@/lib/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidatorOutput | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [zipFiles, setZipFiles] = useState<FileMap | null>(null);
  const [rubricsText, setRubricsText] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  const runValidation = useCallback(
    async (files: FileMap, rubrics: string) => {
      setIsLoading(true);
      setError("");
      setResult(null);
      try {
        const output = runAllValidators(files, rubrics);
        setResult(output);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Validation failed"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleZipFile = useCallback(
    async (file: File) => {
      setError("");
      setResult(null);
      setFileName(file.name);
      try {
        const files = await extractZip(file);
        setZipFiles(files);
        if (rubricsText.trim()) {
          await runValidation(files, rubricsText);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process the ZIP file"
        );
      }
    },
    [rubricsText, runValidation]
  );

  const handleRubricsChange = useCallback(
    (text: string) => {
      setRubricsText(text);
      setResult(null);
    },
    []
  );

  const handleValidate = useCallback(async () => {
    if (!zipFiles || !rubricsText.trim()) return;
    await runValidation(zipFiles, rubricsText);
  }, [zipFiles, rubricsText, runValidation]);

  const handleReset = useCallback(() => {
    setResult(null);
    setFileName("");
    setError("");
    setZipFiles(null);
    setRubricsText("");
  }, []);

  const canValidate = !!zipFiles && rubricsText.trim().length > 0 && !isLoading;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
          SkillsBench Task Validator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Upload your task ZIP and paste your rubrics JSON to validate
          everything against the pre-submission checklist. All processing
          happens in your browser.
        </p>
      </div>

      {!result && (
        <>
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="mb-6 mx-auto flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showTutorial ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {showTutorial
              ? "Hide tutorial"
              : "How to create your rubrics JSON"}
          </button>

          {showTutorial && <Tutorial />}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                1. Task ZIP file
                {zipFiles && (
                  <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-normal">
                    Loaded
                  </span>
                )}
              </label>
              <FileUploader onFileSelected={handleZipFile} isLoading={false} />
              {fileName && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                  {fileName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                2. Rubrics JSON
              </label>
              <RubricsInput
                value={rubricsText}
                onChange={handleRubricsChange}
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={handleValidate}
              disabled={!canValidate}
              className={`
                px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200
                ${
                  canValidate
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validating...
                </span>
              ) : !zipFiles && !rubricsText.trim() ? (
                "Upload ZIP and paste rubrics to validate"
              ) : !zipFiles ? (
                "Upload your task ZIP first"
              ) : !rubricsText.trim() ? (
                "Paste your rubrics JSON to continue"
              ) : (
                "Validate Task"
              )}
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Validated:{" "}
              <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                {fileName}
              </span>
            </p>
            <button
              onClick={handleReset}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Start over
            </button>
          </div>

          <ValidationReport output={result} />
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600">
        No data leaves your browser. All validation is client-side.
      </footer>
    </main>
  );
}
