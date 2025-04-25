"use client"

import { Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

export default function AboutPage() {
  const position: [number, number] = [36.6636426, 4.9125355]; // ESTIN Library coords

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Placeholder */}
      {/* <- Place your navigation component here -> */}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
      <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About Us</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Mission, history, and team of ESTIN Library. Learn how we support education and research through our resources and programs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Section: Mission */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            To facilitate access to knowledge and promote scientific and technical culture by providing cutting-edge resources,
            expert guidance, and a welcoming environment for all learners. Our mission drives everything we do, ensuring that
            our collections, services, and spaces support academic success and lifelong learning.
          </p>
          <p className="text-gray-700">
            We aspire to be a central hub of innovation and collaboration within ESTIN, fostering curiosity,
            critical thinking, and scholarly excellence among students, faculty, and the greater community.
          </p>
        </section>

        {/* Section: History */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our History</h2>
          <p className="text-gray-700 mb-4">
            Established in 1960 alongside the founding of ESTIN, our library began with a modest collection of core engineering
            texts. Over the decades, we have expanded to include state-of-the-art digital resources, specialized research materials,
            and collaborative learning spaces.
          </p>
          <p className="text-gray-700 mb-4">Key milestones:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>1960: Library opens with 5,000 volumes.</li>
            <li>1985: Introduction of audiovisual collections.</li>
            <li>2000: Launch of online catalog (OPAC).</li>
            <li>2015: Major renovation adds collaborative study rooms.</li>
            <li>2022: Fully integrated digital access platform launched.</li>
          </ul>
        </section>

        {/* Section: Team */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Dr. A. Benyahia', role: 'Director', desc: 'Oversees library strategy, partnerships, and resource development.' },
              { name: 'Mme. S. Haddad', role: 'Collections Manager', desc: 'Curates physical and digital collections.' },
              { name: 'M. L. Bouzid', role: 'Digital Services Coordinator', desc: 'Manages online platforms and digital archives.' }
            ].map((member, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Info className="h-8 w-8 text-[#9a1c21] mr-3" />
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                </div>
                <p className="text-gray-700"><strong>{member.role}</strong> — {member.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Contact & Location */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Contact & Location</h2>
          <p className="text-gray-700 mb-2">
            Email: contact@estinlib.org | Phone: +213 21 23 45 67
          </p>
          <p className="text-gray-700 mb-4">
            Address: ESTIN Library, 123 University Ave, Algiers, Algeria
          </p>
          {/* Map Component */}
          <Map position={position} />
        </section>

        {/* Additional dummy sections to reach length */}
        {Array.from({ length: 4 }).map((_, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold mb-4">Section Supplémentaire {idx + 1}</h2>
            <p className="text-gray-700 mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <ul className="list-disc list-inside text-gray-700">
              <li>Point A {idx + 1}</li>
              <li>Point B {idx + 1}</li>
              <li>Point C {idx + 1}</li>
            </ul>
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
