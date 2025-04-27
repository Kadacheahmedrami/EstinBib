import Footer from '@/components/Footer';
import Image from 'next/image';

// Données culturelles réelles et visuels avec URLs stables
const explorations = [
  {
    title: "Salle de lecture en plein air",
    description: "Aménagement de la terrasse de la bibliothèque en espace de lecture ouvert, inauguré le 24 octobre 2024.",
    url: "/actualites/lecture-plein-air",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Atelier de peinture à la bibliothèque",
    description: "Création d'un atelier artistique dans la bibliothèque pour encourager la créativité des étudiants (démarré en octobre 2024).",
    url: "/actualites/atelier-peinture",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=compress&cs=tinysrgb&w=800",
  },
];

const theatreSpaces = [
  {
    title: "Salle de théâtre de la bibliothèque",
    description: "Nouvel espace scénique conçu pour les répétitions et petits spectacles, ouvert depuis janvier 2025.",
    url: "/culture/theatre-biblio",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=compress&cs=tinysrgb&w=800",
  },
];

const concerts = [
  {
    title: "Concert de la chorale ESTIN",
    description: "Première représentation publique de la chorale de l'ESTIN, 16 avril 2025, initiée par le Club RASA.",
    url: "/events/chorale-estin",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Soirée musicale RASA",
    description: "Concert instrumental et vocal organisé lors de l'inauguration du Club RASA le 16 avril 2025.",
    url: "/events/soiree-rasa",
    image: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?auto=compress&cs=tinysrgb&w=800",
  },
];

const clubs = [
  {
    name: "Club Artistique, Culturel et Scientifique RASA",
    founded: "16 avril 2025",
    activities: ["Théâtre", "Musique (chorale, instruments)", "Arts plastiques", "Littérature"],
    social: {
      instagram: "https://www.instagram.com/rasa.estin/",
      facebook: "https://www.facebook.com/estin.amizour.bejaia/videos/993238352984790/"
    },
    image: "https://images.unsplash.com/photo-1523307730650-594bc63f9d67?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
      <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Culture</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Découvrez nos expositions, conférences, ateliers et événements culturels organisés tout au long de l’année.
          </p>
        </div>
      </div>


      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 space-y-16">
        {/* Section: Explorations culturelles */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Explorations culturelles</h2>
          <div className="space-y-8">
            {explorations.map((item, idx) => (
              <div
                key={idx}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <a href={item.url} className="text-[#9a1c21] font-medium hover:underline">
                    En savoir plus
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Théâtre & Scène */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Théâtre & Scène</h2>
          <div className="space-y-8">
            {theatreSpaces.map((space, idx) => (
              <div
                key={idx}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={space.image}
                  alt={space.title}
                  width={800}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{space.title}</h3>
                  <p className="text-gray-700 mb-4">{space.description}</p>
                  <a href={space.url} className="text-[#9a1c21] font-medium hover:underline">
                    Découvrir
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Concerts & Musique */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Concerts & Musique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {concerts.map((concert, idx) => (
              <div
                key={idx}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={concert.image}
                  alt={concert.title}
                  width={800}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{concert.title}</h3>
                  <p className="text-gray-700 mb-4">{concert.description}</p>
                  <a href={concert.url} className="text-[#9a1c21] font-medium hover:underline">
                    Plus d'infos
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Clubs artistiques */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Clubs & Associations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clubs.map((club, idx) => (
              <div
                key={idx}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Image
                  src={club.image}
                  alt={club.name}
                  width={800}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{club.name}</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Fondé le :</strong> {club.founded}
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Activités :</strong> {club.activities.join(', ')}
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href={club.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9a1c21] font-medium hover:underline"
                    >
                      Instagram
                    </a>
                    <a
                      href={club.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9a1c21] font-medium hover:underline"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}