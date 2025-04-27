import { Calendar, Users, Globe } from 'lucide-react';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function EventsPage() {
  // Data for clubs and events
  const clubs = [
    {
      name: 'ByteCraft Club',
      icon: Users,
      description:
        "The largest scientific club at ESTIN, founded in 2021. ByteCraft focuses on computer science, AI, and deep learning. Join hackathons, workshops, and bootcamps organized by passionate students.",
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      link: 'https://fr.linkedin.com/company/bytecraft-club',
    },
    {
      name: 'Origo Nature Club',
      icon: Users,
      description:
        "Origo.club promotes sustainability and eco-friendly initiatives on campus. Attend tree-planting drives, nature walks, and environmental workshops.",
      image: 'https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg',
      link: 'https://www.instagram.com/flagson.dz',
    },
  ];

  const events = [
    {
      name: "C2I2A'25 - AI Conference",
      icon: Globe,
      date: 'June 3–5, 2025',
      venue: 'ESTIN Campus, Amizour',
      description:
        "An international symposium on AI applications, featuring keynote speakers from academia and industry.",
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
      link: 'https://c2i2a.estin.dz/',
    },
    {
      name: 'LDC Football Tournament',
      icon: Calendar,
      date: 'December 8, 2024',
      venue: 'ESTIN Stadium',
      description:
        "Join the annual football tournament co-hosted by ESTIN and Club LDC for a day of sportsmanship and community spirit.",
      image: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg',
      link: '/events/ldc-tournament',
    },
    {
      name: 'Wadifny Innovation Showcase',
      icon: Globe,
      date: 'September 12, 2024',
      venue: 'Oued Amizour Grounds',
      description:
        "Students present their pioneering projects in collaboration with the Wadifny platform—celebrating innovation and entrepreneurship.",
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
      link: '/events/estin-wadifny',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Placeholder */}

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
      <div className="container mx-auto px-6 py-16 space-y-32">
        {/* Clubs Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#9a1c21] mb-8">Student Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {clubs.map((club, idx) => (
                <div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                <Image
                  src={club.image}
                  alt={club.name}
                  width={800}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                  <club.icon className="h-6 w-6 text-[#9a1c21] mr-2" />
                  <h3 className="text-2xl font-semibold">{club.name}</h3>
                  </div>
                  <p className="text-gray-700 mb-4">{club.description}</p>
                  <a
                  href={club.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c13b42] font-medium hover:underline"
                  >
                  Learn More
                  </a>
                </div>
                </div>
            ))}
          </div>
        </section>

        {/* Events Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#9a1c21] mb-8">Conferences & Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((ev, idx) => (
                <div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                <Image
                  src={ev.image}
                  alt={ev.name}
                  width={800}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                  <ev.icon className="h-6 w-6 text-[#c13b42] mr-2" />
                  <h3 className="text-2xl font-semibold">{ev.name}</h3>
                  </div>
                  <p className="text-gray-700 mb-1"><strong>Date:</strong> {ev.date}</p>
                  <p className="text-gray-700 mb-3"><strong>Venue:</strong> {ev.venue}</p>
                  <p className="text-gray-700 mb-4">{ev.description}</p>
                  <a
                  href={ev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9a1c21] font-medium hover:underline"
                  >
                  More Details
                  </a>
                </div>
                </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
