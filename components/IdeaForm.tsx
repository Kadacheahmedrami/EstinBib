"use client";

import React, { useState, type FormEvent, type ChangeEvent } from "react";
import { SendIcon } from "lucide-react";
import { suggestIdea } from "@/app/actions/forms";
import Image from "next/image";

export function IdeaForm() {
  const [idea, setIdea] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setIdea(value);
      setErrors(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors(null);
    const text = idea.trim();
    if (!text) {
      setErrors("Votre idée est requise.");
      return;
    }
    if (text.length > 500) {
      setErrors("Votre idée ne doit pas dépasser 500 caractères.");
      return;
    }
    setIsSubmitting(true);
    try {
      await suggestIdea(text);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrors(err.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIdea("");
    setIsSubmitted(false);
    setErrors(null);
  };

  return (
    <>
      {/* Submission Modal */}
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
                    Votre idée a été
                    <br />
                    envoyée !
                  </h1>
                  <p className="text-gray-600 text-lg sm:text-xl">
                    Merci pour votre contribution. Nous analyserons votre idée et vous tiendrons informé.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="px-6 md:w-1/2 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      ← Retour à l'accueil
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 md:w-1/2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200"
                    >
                      Soumettre une autre idée
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-[#0A2942] text-4xl font-bold mb-4">
            Proposez{' '}
            <span className="relative inline-block">
              une idée
              <span
                className="absolute inset-x-0 bottom-0 h-3 -z-10"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', transform: 'translateY(2px)' }}
              />
            </span>
          </h1>
          <p className="text-gray-700 text-lg">
            Vous avez une idée innovante ? Partagez-la avec nous ci-dessous !
          </p>
        </div>

        {errors && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p>{errors}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="idea" className="block text-gray-700 mb-2">
              Votre idée <span className="text-red-500">*</span>
            </label>
            <textarea
              id="idea"
              name="idea"
              value={idea}
              onChange={handleChange}
              placeholder="Décrivez votre idée ici..."
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y min-h-[150px]"
              maxLength={500}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              {idea.length}/500 caractères
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Envoi…' : 'Envoyer →'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-gray-500 text-sm">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>
      </div>
    </>
  );
}
