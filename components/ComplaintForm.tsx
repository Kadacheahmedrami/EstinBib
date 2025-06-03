// app/components/forms/ComplaintForm.tsx
"use client";

import { useState } from "react";
import { submitComplaint } from "@/app/actions/forms";
import { AlertCircle, CheckCircle, Send } from "lucide-react";

export default function ComplaintForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitComplaint({
        title,
        description,
        isPrivate,
      });

      if (result.success) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setIsPrivate(true);
      } else {
        setError(result.error || "Failed to submit complaint");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {success ? (
        <div className=" border rounded-lg p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-semibold">Complaint Submitted Successfully</h2>
            <p className="text-gray-400 max-w-md">
              Thank you for your feedback. Your complaint has been recorded and will be reviewed by our team.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-gray-900 font-medium rounded-md transition-colors duration-300 shadow-lg"
            >
              Submit Another Complaint
            </button>
          </div>
        </div>
      ) : (
        <div className=" border rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 bg-red-900/40 border border-red-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                  placeholder="Brief summary of your complaint"
                  maxLength={100}
                  required
                />
                <p className="mt-1 text-xs text-gray-400">{title.length}/100 characters maximum</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-gray-900 resize-none"
                  placeholder="Please provide details of your complaint..."
                  required
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-5 w-5 rounded text-red-500 focus:ring-red-500"
                />
                <label htmlFor="isPrivate" className="ml-3 text-sm text-gray-300">
                  Make this complaint private (only visible to you and administrators)
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full flex justify-center items-center px-6 py-3 rounded-md text-white font-medium shadow-lg ${
                    submitting
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-colors duration-300"
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 sm:px-8 sm:py-5">
            <p className="text-xs text-gray-400">
              <span className="text-red-500 font-semibold">Note:</span> All submitted complaints are subject to review
              by our administrative team. We aim to respond to all complaints within 48 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}