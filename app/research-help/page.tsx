import {
  ExternalLink,
  Video,
  BookOpen,
  Search,
  Mail,
  Calendar,
  Headphones
} from "lucide-react";
import Footer from '@/components/Footer';

export default function ResearchHelpPage() {
  const categories = [
    {
      title: 'Library Services',
      bg: 'bg-white',
      items: [
        {
          name: 'Visite Guidée',
          description: 'Visite virtuelle 360° de la Bibliothèque ESTIN.',
          link: 'https://visitevirtuelle.estin.dz/',
          Icon: Video,
        },
        {
          name: 'OPAC ESTIN',
          description: 'Consultez et réservez vos documents en ligne.',
          link: '/catalogue',
          Icon: Search,
        },
        {
          name: 'Catalogue Collectif d’Algérie',
          description: 'Regroupement des collections des bibliothèques universitaires.',
          link: 'https://ccn.cerist.dz/',
          Icon: BookOpen,
        },
        {
          name: 'Portail National des Thèses',
          description: 'Signalement et accès aux thèses soutenues en Algérie.',
          link: 'https://theses.cerist.dz/',
          Icon: BookOpen,
        },
      ],
    },
    {
      title: 'Guides & Documentation',
      bg: 'bg-gray-50',
      items: [
        {
          name: 'Zotero',
          description: 'Gestionnaire gratuit de références bibliographiques.',
          link: 'https://www.zotero.org/',
          Icon: BookOpen,
        },
        {
          name: 'Mendeley',
          description: 'Références et réseau social académique.',
          link: 'https://www.mendeley.com/',
          Icon: BookOpen,
        },
        {
          name: 'Overleaf',
          description: 'Éditeur LaTeX en ligne pour la rédaction collaborative.',
          link: 'https://www.overleaf.com/learn',
          Icon: BookOpen,
        },
        {
          name: 'Purdue OWL',
          description: 'Guide de style et ressources pour la rédaction académique.',
          link: 'https://owl.purdue.edu/',
          Icon: BookOpen,
        },
      ],
    },
    {
      title: 'Consultations & Ateliers',
      bg: 'bg-white',
      items: [
        {
          name: 'Service de Référence',
          description: 'Posez vos questions et obtenez de l’aide personnalisée.',
          link: 'mailto:bibliotheque@estin.dz',
          Icon: Mail,
        },
        {
          name: 'Prendre Rendez-vous',
          description: 'Réservez une session de conseil avec nos bibliothécaires.',
          link: '/consultation',
          Icon: Calendar,
        },
        {
          name: 'Atelier Recherche Bibliographique',
          description: 'Formation pratique aux méthodes de recherche documentaire.',
          link: '/events/bibliographic-workshop',
          Icon: Headphones,
        },
        {
          name: 'Atelier Zotero',
          description: 'Initiation et prise en main de Zotero.',
          link: '/events/zotero-training',
          Icon: Headphones,
        },
      ],
    },
    {
      title: 'Research Tools & Databases',
      bg: 'bg-gray-50',
      items: [
        {
          name: 'Google Scholar',
          description: 'Recherche de littérature académique mondiale.',
          link: 'https://scholar.google.com/',
          Icon: Search,
        },
        {
          name: 'arXiv',
          description: 'Prépublications en physique, mathématiques et informatique.',
          link: 'https://arxiv.org/',
          Icon: BookOpen,
        },
        {
          name: 'PubMed',
          description: 'Base en sciences de la vie et biomédecine.',
          link: 'https://pubmed.ncbi.nlm.nih.gov/',
          Icon: BookOpen,
        },
        {
          name: 'DOAJ',
          description: 'Directory of Open Access Journals.',
          link: 'https://doaj.org/',
          Icon: BookOpen,
        },
        {
          name: 'BASE',
          description: 'Moteur de recherche académique avec 250 M+ docs.',
          link: 'https://www.base-search.net/',
          Icon: Search,
        },
        {
          name: 'CORE',
          description: 'Millions d’articles en libre accès.',
          link: 'https://core.ac.uk/',
          Icon: Search,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
        <div
          className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"
        />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Research Help
          </h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Nos services d’accompagnement à la recherche : guides, consultations
            personnalisées, ateliers et outils pour réussir vos projets.
          </p>
        </div>
      </div>

      {/* Sections */}
      <main className="flex-grow">
        {categories.map((cat, idx) => (
          <section key={idx} className={`${cat.bg} py-12`}>
            <div className="container mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#9a1c21] mb-6">
                {cat.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.items.map((res, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow flex flex-col"
                  >
                    <div className="p-6 flex-grow">
                      <div className="flex items-center mb-3">
                        <res.Icon className="h-6 w-6 text-[#9a1c21] mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {res.name}
                        </h3>
                      </div>
                      <p className="text-gray-700">{res.description}</p>
                    </div>
                    <div className="px-6 pb-6">
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#9a1c21] font-medium hover:underline"
                      >
                        Access&nbsp;Resource
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
