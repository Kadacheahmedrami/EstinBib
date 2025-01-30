"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";

interface FormData {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  releaseYear: string;
}

interface FormErrors {
  isbn?: string;
  title?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    releaseYear: "2004/22/22",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Book title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Form submitted:", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      isbn: "",
      title: "",
      author: "",
      publisher: "",
      releaseYear: "2004/22/22",
    });
    setIsSubmitted(false);
  };

  return (
    <>
      {/* Custom Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl rounded-[15px] mx-4 animate-fade-in">
            <Image
              className="mb-[-120px] relative bottom-[120px]"
              height={200}
              width={140}
              alt="suggestion"
              src="/svg/pretty.svg"
            />
            <div className="w-full bg-white m-auto p-6 rounded-[15px]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-6 max-w-xl">
                  <h1 className="text-[#0A2942] text-4xl font-extrabold leading-tight">
                    Your Suggestion Has Been
                    <br />
                    Sent!
                  </h1>
                  <p className="text-gray-600 text-lg sm:text-xl">
                    Our team will review your suggestion and consider adding it to our collection. A responsible team
                    member will get back to you soon. Please check your email for updates.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="px-6 md:w-1/2 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      ← Return to Home
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 md:w-1/2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200"
                    >
                      Suggest Another
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-[#0A2942] text-4xl font-bold mb-6">
              Suggest{" "}
              <span className="relative">
                A Book
                <span
                  className="absolute inset-x-0 bottom-0 h-3 -z-10"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    transform: "translateY(2px)",
                  }}
                />
              </span>
            </h1>
            <p className="text-gray-700 text-lg">
              If there is a book that you think would be a great addition to our shelves but you don&apos;t see it
              listed in our catalog, please fill out this Book Suggestion Form.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">
                Book&apos;s ISBN<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.isbn ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
            </div>

            <div className="form-group">
              <label className="block text-gray-700 mb-2">
                Book title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="block text-gray-700 mb-2">Book&apos;s author(s)</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-gray-700 mb-2">Book publisher</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-gray-700 mb-2">Release year</label>
              <input
                type="text"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-md transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Sending..." : "Send →"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-gray-500">
            <span className="text-red-500">*</span> : Required Fields
          </p>
        </div>
      </div>
    </>
  );
}