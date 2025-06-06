"use client"

import React, { useState, useTransition, useEffect } from "react"
import { requestSndlAccount, getExistingSndlRequest } from "@/app/actions/sndl"

export default function SNDLRequestForm() {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [requestReason, setRequestReason] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingRequest, setExistingRequest] = useState<any>(null)

  useEffect(() => {
    const loadExistingRequest = async () => {
      try {
        const existing = await getExistingSndlRequest()
        setExistingRequest(existing)
      } catch (err) {
        setError("Failed to load request status")
      } finally {
        setIsLoading(false)
      }
    }
    loadExistingRequest()
  }, [])

  const handleSubmit = async () => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "yellow"
      case "APPROVED": return "green"
      case "REJECTED": return "red"
      default: return "gray"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      case "APPROVED":
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case "REJECTED":
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default: return null
    }
  }

  if (isLoading) {
    return (
      <div className="">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your request status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Request SNDL Access</h1>
          <p className="text-gray-600 mt-2">
            Submit your request for access to the Service National de Diffusion de Livres
          </p>
        </div>

        {/* Existing Request Status */}
        {existingRequest && !success && (
          <div className={`bg-white rounded-lg shadow-lg border-l-4 border-l-${getStatusColor(existingRequest.status)}-500 mb-6`}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Current Request Status</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(existingRequest.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(existingRequest.status)}-100 text-${getStatusColor(existingRequest.status)}-800`}>
                    {existingRequest.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Original Request</label>
                <div className="bg-gray-50 rounded-md p-3 border">
                  <p className="text-gray-700">{existingRequest.requestReason}</p>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">
                Submitted on {new Date(existingRequest.createdAt).toLocaleDateString()}
              </p>

              {existingRequest.status === "PENDING" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-yellow-800">Request Under Review</h4>
                      <p className="text-yellow-700 text-sm">Your request is being reviewed. You'll receive an email notification once a decision is made.</p>
                    </div>
                  </div>
                </div>
              )}

              {existingRequest.status === "APPROVED" && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-green-800">Access Granted!</h4>
                      <p className="text-green-700 text-sm">Your SNDL access has been approved. Check your email for login credentials.</p>
                    </div>
                  </div>
                </div>
              )}

              {existingRequest.status === "REJECTED" && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-red-800">Request Declined</h4>
                      <p className="text-red-700 text-sm mb-2">Unfortunately, your request was not approved.</p>
                      {existingRequest.rejectionReason && (
                        <p className="text-red-600 text-sm italic mb-3">Reason: {existingRequest.rejectionReason}</p>
                      )}
                      <button
                        onClick={() => setExistingRequest(null)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-sm"
                      >
                        Submit New Request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        )}

        {/* Request Form */}
        {!existingRequest && !success && (
          <div className="bg-white rounded-lg shadow-lg border-t-4 border-t-red-500">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">SNDL Registration Form</h2>
              <p className="text-gray-500 mt-1">
                If you need access to the SNDL system, please fill out this form. An administrator will review your
                request.
              </p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  onClick={handleSubmit}
                  disabled={isPending || !requestReason.trim()}
                  className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ${
                    isPending || !requestReason.trim() ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isPending ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border shadow-sm">
            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 text-sm">Processing time: 3-5 business days</span>
          </div>
        </div>
      </div>
    </div>
  )
}