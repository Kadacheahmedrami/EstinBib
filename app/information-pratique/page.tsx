import {
  ExternalLink,
  FileText,
  Calendar,
  UserPlus,
  CheckCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function InformationPratiquePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Placeholder */}

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
        <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Information Pratique
          </h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Retrouvez ici le règlement, les horaires, les modalités d’inscription et de quitus,
            ainsi que nos coordonnées.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-16 space-y-16 flex-grow">
        {/* 1. Règlement intérieur */}
        <section>
          <h2 className="text-3xl font-bold text-[#9a1c21] mb-4 flex items-center">
            <FileText className="mr-2"/> Règlement intérieur
          </h2>
          <p className="text-gray-700 mb-4">
            Le règlement intérieur de la Bibliothèque Centrale de l’ESTIN-Amizour
            fixe les conditions d’accès, d’emprunt et de discipline.
          </p>
          <a
            href="/library-regulations"
            className="inline-flex items-center px-6 py-3 bg-[#9a1c21] text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
          >
            Télécharger le PDF
            <ExternalLink className="ml-2 h-5 w-5" />
          </a>
        </section>

        {/* 2. Horaires */}
        <section>
          <h2 className="text-3xl font-bold text-[#9a1c21] mb-6 flex items-center">
            <Calendar className="mr-2"/> Horaires d’ouverture
          </h2>
          <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ouvert</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Dimanche – Jeudi : 8 h 00 – 12 h 00 &nbsp;|&nbsp; 13 h 00 – 16 h 30</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Fermé</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Vendredi & Samedi</li>
                <li>Jours fériés & vacances d’été</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Inscription */}
        <section>
          <h2 className="text-3xl font-bold text-[#9a1c21] mb-6 flex items-center">
            <UserPlus className="mr-2"/> Modalités d’inscription
          </h2>
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <p className="text-gray-700">
              L’inscription est <strong>gratuite</strong> et obligatoire pour accéder aux services de la bibliothèque.
            </p>
            <ul className="list-decimal list-inside text-gray-700 space-y-2">
              <li>
                <strong>Étudiants ESTIN</strong> : présenter carte d’étudiant ou certificat de scolarité valide.
              </li>
              <li>
                <strong>Enseignants & Personnel</strong> : présenter attestation ou carte professionnelle.
              </li>
              <li>
                Renouvellement annuel au service d’accueil.
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Quitus */}
        <section>
          <h2 className="text-3xl font-bold text-[#9a1c21] mb-6 flex items-center">
            <CheckCircle className="mr-2"/> Quitus
          </h2>
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <p className="text-gray-700">
              Le quitus atteste que vous êtes à jour de vos emprunts et amendes.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Présentez votre carte d’étudiant ou professionnelle au guichet.
              </li>
              <li>
                Quitus délivré dès restitution de tous les documents et paiement des éventuelles pénalités.
              </li>
              <li>
                Nécessaire pour la délivrance de diplômes, transferts ou mutations.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Contact */}
        <section>
          <h2 className="text-3xl font-bold text-[#9a1c21] mb-6 flex items-center">
            <MapPin className="mr-2"/> Contact & Accès
          </h2>
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <p className="flex items-center text-gray-700">
              <Mail className="mr-2 text-[#9a1c21]" /> bibliotheque@estin.dz
            </p>
            <p className="flex items-center text-gray-700">
              <Phone className="mr-2 text-[#9a1c21]" /> +213 34 824 916
            </p>
            <p className="flex items-center text-gray-700">
              <MapPin className="mr-2 text-[#9a1c21]" />
              ESTIN – Bibliothèque Centrale,  
              Route nationale n°75, 06300 Amizour, Béjaïa, Algérie
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
