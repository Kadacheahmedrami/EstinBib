import { Film, ImageIcon, MapPin } from "lucide-react";
import Footer from '@/components/Footer';
import Image from 'next/image';

const videos = [
  {
    title: "Présentation de l'ESTIN Amizour-Bejaia",
    description: "Découvrez l'école supérieure en Sciences et Technologies de l'Informatique et du Numérique",
    url: "https://www.youtube.com/watch?v=ywa9wpIIlAo",
    thumbnail: "https://img.youtube.com/vi/ywa9wpIIlAo/hqdefault.jpg",
  },
  {
    title: "Club school of ai : Compétition IA",
    description: "Retour sur la compétition organisée par le Club School of AI",
    url: "https://www.youtube.com/watch?v=oSczqNOwuH8",
    thumbnail: "https://img.youtube.com/vi/oSczqNOwuH8/hqdefault.jpg",
  },
  {
    title: "Bienvenue à l'ESTIN : Rencontre avec nos nouveaux bacheliers",
    description: "Interview des nouveaux étudiants après la rentrée",
    url: "https://www.youtube.com/watch?v=s81Saf2fDyQ",
    thumbnail: "https://img.youtube.com/vi/s81Saf2fDyQ/hqdefault.jpg",
  },
  {
    title: "Ramadan : Sensibilisation sur le gaspillage alimentaire",
    description: "Campagne de sensibilisation à l'ESTIN durant le Ramadan",
    url: "https://www.youtube.com/channel/UCSyAjFM8pVI5psWxlaGzMeA/videos",
    thumbnail: "https://img.youtube.com/vi/UCSyAjFM8pVI5psWxlaGzMeA/hqdefault.jpg",
  },
];

const multimediaLinks = [
  {
    title: "Chaîne YouTube officielle",
    icon: <Film className="h-8 w-8 text-[#9a1c21]" />,
    url: "https://www.youtube.com/@estinbejaia/videos",
  },
  {
    title: "Page Facebook",
    icon: <ImageIcon className="h-8 w-8 text-[#9a1c21]" />,
    url: "https://www.facebook.com/estin.amizour.bejaia/",
  },
  {
    title: "Compte Instagram",
    icon: <ImageIcon className="h-8 w-8 text-[#9a1c21]" />,
    url: "https://www.instagram.com/estinamizour/",
  },
  {
    title: "Visite virtuelle",
    icon: <MapPin className="h-8 w-8 text-[#9a1c21]" />,
    url: "https://visitevirtuelle.estin.dz/",
  },
];

export default function MultimediaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Placeholder */}

      {/* Hero Section */}
 
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
      <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Multimédia</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
          Explorez nos vidéos, réseaux sociaux et visite virtuelle pour plonger au cœur de la vie à l ESTIN.
          </p>
        </div>
      </div>
      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 space-y-16">
        {/* Videos Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Vidéos & Webinaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={400}
                  height={225}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{video.title}</h3>
                  <p className="text-gray-700 mb-4">{video.description}</p>
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-[#9a1c21] font-medium hover:underline">
                    Voir la vidéo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Socials & Virtual Tour */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Réseaux Sociaux & Visite Virtuelle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {multimediaLinks.map((item, idx) => (
              <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                {item.icon}
                <span className="ml-4 text-xl font-semibold text-gray-800">{item.title}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
