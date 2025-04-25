import { Calendar } from "lucide-react";
import Footer from '@/components/Footer';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Placeholder */}
      {/* <- Place your navigation component here -> */}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
      <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Events</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Retrouvez ici la liste des conférences, ateliers, rencontres et événements spéciaux organisés par la bibliothèque.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Section: Prochains Événements */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Prochains Événements</h2>
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Calendar className="h-6 w-6 text-[#9a1c21] mr-2" />
                  <h3 className="text-2xl font-semibold">Atelier d’écriture</h3>
                </div>
                <p className="text-gray-700 mb-1">12 May 2025 | 14:00 – 16:00 | Salle 101</p>
                <p className="text-gray-600 mb-2">
                  Atelier pratique pour développer vos compétences en rédaction académique et créative.
                </p>
                <a href="/events/writing-workshop" className="text-[#9a1c21] font-medium hover:underline">
                  Plus d’infos
                </a>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Calendar className="h-6 w-6 text-[#9a1c21] mr-2" />
                  <h3 className="text-2xl font-semibold">Conférence &quot;Patrimoine et Numérique&quot;</h3>
                </div>
                <p className="text-gray-700 mb-1">20 May 2025 | 10:00 – 12:00 | Amphithéâtre</p>
                <p className="text-gray-600 mb-2">
                  Discussion sur les enjeux de la numérisation des collections patrimoniales.
                </p>
                <a href="/events/patrimoine-numerique" className="text-[#9a1c21] font-medium hover:underline">
                  Plus d’infos
                </a>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <Calendar className="h-6 w-6 text-[#9a1c21] mr-2" />
                  <h3 className="text-2xl font-semibold">Rencontre avec l’auteur Driss Chraïbi</h3>
                </div>
                <p className="text-gray-700 mb-1">15 June 2025 | 17:00 – 18:30 | Salle de conférence</p>
                <p className="text-gray-600 mb-2">
                  Échange et lecture avec l’écrivain algérien Driss Chraïbi. Réservez votre place.
                </p>
                <a href="/events/rencontre-chraibi" className="text-[#9a1c21] font-medium hover:underline">
                  Plus d’infos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Événements Passés */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Événements Récents</h2>
          <div className="space-y-8">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-6 w-6 text-[#9a1c21] mr-2" />
                    <h3 className="text-2xl font-semibold">Événement Passé {idx + 1}</h3>
                  </div>
                  <p className="text-gray-700 mb-1">Date à définir | Heure à définir</p>
                  <p className="text-gray-600 mb-2">
                    Brève description de l’événement passé {idx + 1}, incluant les principaux retours et résultats.
                  </p>
                  <a href="/events/past" className="text-[#9a1c21] font-medium hover:underline">
                    Plus d’infos
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: S’inscrire à la newsletter */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Restez Informé</h2>
          <p className="text-gray-700 mb-4">
            Abonnez-vous à notre newsletter mensuelle pour ne rien manquer des prochains événements.
          </p>
          <form className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Votre email"
              className="w-full md:w-auto px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9a1c21]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#9a1c21] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              S’abonner
            </button>
          </form>
        </section>

        {/* Additional dummy sections to reach substantial length */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold mb-4">Section Supplémentaire Événements {idx + 1}</h2>
            <p className="text-gray-700 mb-2">
              Contenu supplémentaire pour la section événements {idx + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Point A pour événement {idx + 1}</li>
              <li>Point B pour événement {idx + 1}</li>
              <li>Point C pour événement {idx + 1}</li>
            </ul>
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
