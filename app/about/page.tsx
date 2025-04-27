"use client"

import { Info, Mail } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const services = [
    'Service de l’acquisition et du traitement',
    'Service de la recherche bibliographique',
    'Service de l’accueil et de l’orientation',
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
        <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10 text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About Us</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Mission, history, and team of ESTIN Library. Learn how we support education and research through our resources and programs.
          </p>
        </div>
      </div>

      {/* Director's Note Section */}
      <section className="bg-gradient-to-r from-[#9a1c21]/10 to-[#c13b42]/10 py-16">
        <div className="container mx-auto px-6 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9a1c21] mb-4">Mot du Directeur</h2>
          <p className="text-gray-700 max-w-3xl leading-relaxed">
            Bienvenue à la Bibliothèque ESTIN ! En tant que directeur, je suis fier de vous offrir un espace où le savoir
            et l innovation se rencontrent. Notre équipe reste dédiée à enrichir votre expérience académique
            et à soutenir votre réussite.
          </p>
        </div>
      </section>

      {/* Library in Numbers Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#9a1c21] mb-8">Bibliothèque en Chiffres</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl">
            {[
              { number: '70 000+', label: 'Volumes physiques' },
              { number: '150 000+', label: 'Ressources numériques' },
              { number: '20+', label: 'Salles d’étude' },
              { number: '1 200', label: 'Visites/jour en moyenne' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#c13b42]/5 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-4xl font-extrabold text-[#9a1c21] mb-2">{item.number}</h3>
                <p className="text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   {/* Enhanced Organizational Chart Section */}
   <section className="bg-gray-50 py-16">
      <div className=" md:container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-red-700 mb-12">Organigramme</h2>
        
        <div className="relative mx-auto w-full md:max-w-4xl">
          {/* Director box */}
          <div className="flex justify-center">
            <div className="border-2 border-red-700 text-red-700 font-semibold bg-white p-4 rounded-md w-64 shadow-md">
              Directeur de l école
            </div>
          </div>
          
          {/* Vertical line to library director */}
          <div className="w-1 h-16 bg-red-600 mx-auto"></div>
          
          {/* Library Director box */}
          <div className="flex justify-center">
            <div className="border-2 border-red-600 text-red-600 font-semibold bg-white p-4 rounded-md w-64 shadow-md">
              Directeur de la bibliothèque
            </div>
          </div>
          
          {/* Vertical line to horizontal connector */}
          <div className="w-1 h-16 bg-red-600 mx-auto"></div>

          {/* Horizontal line connecting all services */}
          <div className="relative h-1">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[69%] h-1 bg-red-600"></div>
          </div>
          
          {/* Services section with connected lines */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-8 w-full max-w-4xl mt-0">
              {services.map((service, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Vertical line that connects to the box */}
                  <div className="w-1 h-8 bg-red-600"></div>
                  
                  <div className="border-2 border-red-500 text-red-600 bg-white p-3 rounded-md w-full shadow-md">
                    {service}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>


      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 space-y-24">
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            To facilitate access to knowledge and promote scientific and technical culture by providing cutting-edge resources,
            expert guidance, and a welcoming environment for all learners.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Our History</h2>
          <p className="text-gray-700 leading-relaxed">
            Established in 1960 alongside the founding of ESTIN, our library began with a modest collection of core engineering texts.
          </p>
        </section>

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

        <section>
          <h2 className="text-3xl font-bold mb-6">Contact & Location</h2>
          <p className="text-gray-700 mb-2 flex items-center">
            <Mail className="h-5 w-5 text-[#9a1c21] mr-2" /> contact@estinlib.org
          </p>
          <p className="text-gray-700 flex items-center">
            <Info className="h-5 w-5 text-[#9a1c21] mr-2" /> +213 21 23 45 67
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
