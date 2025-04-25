"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { requestSndlAccount } from "@/app/actions/sndl"

export default function SNDLRequestPage() {
  const [isPending, startTransition] = useTransition()
  const [requestReason, setRequestReason] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!requestReason.trim()) {
      setError("Please provide a reason for your request")
      return
    }

    startTransition(async () => {
      try {
        await requestSndlAccount(requestReason)
        setSuccess(true)
        setRequestReason("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while submitting your request")
      }
    })
  }

  const resetForm = () => {
    setSuccess(false)
    setError(null)
    setRequestReason("")
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">Request SNDL Access</h1>
        <p className="text-gray-600 mt-2">
          Submit your request for access to the Service National de Diffusion de Livres
        </p>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-semibold text-green-800">Request Submitted Successfully</h3>
          </div>
          <p className="text-green-700 mb-4">
            Your SNDL access request has been submitted. An administrator will review your request and contact you via
            email with your account details once approved.
          </p>
          <button
            onClick={resetForm}
            className="px-4 py-2 border border-green-300 text-green-600 rounded-md hover:bg-green-50 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg border-t-4 border-t-red-500">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">SNDL Registration Form</h2>
            <p className="text-gray-500 mt-1">
              If you need access to the SNDL system, please fill out this form. An administrator will review your
              request.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="requestReason" className="block text-gray-700 font-medium mb-2">
                Reason for Request <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requestReason"
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder="Please explain why you need access to the SNDL system"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[120px]"
              />
              <p className="text-gray-500 text-sm mt-1">
                Provide details about your research or academic needs for SNDL access
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ${
                  isPending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
