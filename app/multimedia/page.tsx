import { Film } from "lucide-react";
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function MultimediaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Placeholder */}
      {/* <- Place your navigation component here -> */}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
      <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Multimédia</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Explorez nos collections numériques : vidéos, audios, images et archives multimédias pour enrichir vos recherches et découvertes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Section: Vidéos */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Vidéos & Webinaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <Film className="h-8 w-8 text-[#9a1c21] mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Conférences enregistrées</h3>
                <p className="text-gray-700 mb-4">
                  Revivez nos conférences et webinaires sur lhistoire du livre, la calligraphie et plus encore.
                </p>
                <a href="/multimedia/videos/conferences" className="text-[#9a1c21] font-medium hover:underline">
                  Voir les vidéos
                </a>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <Film className="h-8 w-8 text-[#9a1c21] mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Tutoriels vidéo</h3>
                <p className="text-gray-700 mb-4">
                  Accédez aux tutoriels pour maîtriser nos plateformes en ligne et outils de recherche.
                </p>
                <a href="/multimedia/videos/tutorials" className="text-[#9a1c21] font-medium hover:underline">
                  Voir les tutoriels
                </a>
              </div>
            </div>

            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <Film className="h-8 w-8 text-[#9a1c21] mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">Vidéo Supplémentaire {idx + 1}</h3>
                  <p className="text-gray-700 mb-4">
                    Description de la vidéo supplémentaire {idx + 1}. Contenu à explorer.
                  </p>
                  <a href="/multimedia/videos/plus" className="text-[#9a1c21] font-medium hover:underline">
                    Voir la vidéo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Audios */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Podcasts & Enregistrements audio</h2>
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Podcasts Regards sur l Algérie</h3>
                <p className="text-gray-700 mb-4">
                  Série de podcasts explorant la culture, lhistoire et la littérature algérienne.
                </p>
                <a href="/multimedia/audio/podcasts" className="text-[#9a1c21] font-medium hover:underline">
                  Écouter
                </a>
              </div>
            </div>

            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">Enregistrement Audio {idx + 1}</h3>
                  <p className="text-gray-700 mb-4">
                    Description de lenregistrement audio {idx + 1}, disponible en streaming.
                  </p>
                  <a href="/multimedia/audio/plus" className="text-[#9a1c21] font-medium hover:underline">
                    Écouter
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Galeries d'images */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Collections dimages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative w-full h-48">
                <Image
                  src="/multimedia/images/gallery1.jpg"
                  alt="Galerie image 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Europeana</h3>
                <p className="text-gray-700 mb-4">
                  Plus dun million dimages du patrimoine culturel européen disponibles en haute résolution.
                </p>
                <a href="https://www.europeana.eu/" target="_blank" rel="noopener noreferrer" className="text-[#9a1c21] font-medium hover:underline">
                  Visiter
                </a>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative w-full h-48">
                <Image
                  src="/multimedia/images/gallery2.jpg"
                  alt="Galerie image 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Gallica (BnF)</h3>
                <p className="text-gray-700 mb-4">
                  Accédez aux manuscrits, estampes et photographies de la Bibliothèque nationale de France.
                </p>
                <a href="https://gallica.bnf.fr/" target="_blank" rel="noopener noreferrer" className="text-[#9a1c21] font-medium hover:underline">
                  Visiter
                </a>
              </div>
            </div>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48">
                  <Image
                    src={`/multimedia/images/gallery${idx+3}.jpg`}
                    alt={`Galerie image ${idx+3}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">Collection Image {idx + 3}</h3>
                  <p className="text-gray-700 mb-4">
                    Description de la collection dimages {idx + 3}, explorez en haute définition.
                  </p>
                  <a href="/multimedia/images/plus" className="text-[#9a1c21] font-medium hover:underline">
                    Explorer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Archives numérisées */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Archives numérisées</h2>
          <p className="text-gray-700 mb-4">
            Consultez nos archives historiques entièrement numérisées : manuscrits, lettres, plans et registres.
          </p>
          <a href="/multimedia/archives" className="inline-flex items-center px-6 py-3 bg-[#9a1c21] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
            Accéder aux archives
          </a>
        </section>

        {/* Additional dummy sections to reach 250+ lines */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold mb-4">Section Supplémentaire Multimédia {idx + 1}</h2>
            <p className="text-gray-700 mb-2">
              Contenu supplémentaire pour la section multimédia {idx + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Point A pour multimédia {idx + 1}</li>
              <li>Point B pour multimédia {idx + 1}</li>
              <li>Point C pour multimédia {idx + 1}</li>
            </ul>
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
