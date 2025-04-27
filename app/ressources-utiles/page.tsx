import { ExternalLink, BookOpen } from "lucide-react";
import Footer from '@/components/Footer';

export default function RessourcesUtilesPage() {
  const categories = [
    {
      title: 'Algerian & Francophone Platforms',
      bg: 'bg-white',
      items: [
        {
          name: 'ASJP – Algerian Scientific Journals Platform',
          description: 'Plateforme d’édition électronique des revues scientifiques algériennes (CERIST).',
          link: 'https://asjp.cerist.dz/en',
        },
        {
          name: 'Cairn.info',
          description: 'Revues et ouvrages francophones en sciences humaines et sociales.',
          link: 'https://www.cairn.info/',
        },
        {
          name: 'Technique de l’Ingénieur',
          description: 'Base de données technique et technologique pour ingénieurs et chercheurs.',
          link: 'https://www.techniques-ingenieur.fr/',
        },
      ],
    },
    {
      title: 'Multidisciplinary & Open Access',
      bg: 'bg-gray-50',
      items: [
        {
          name: 'SpringerLink',
          description: 'Accès aux revues et livres scientifiques (STEM, médecine, sciences sociales…).',
          link: 'https://link.springer.com/',
        },
        {
          name: 'ScienceDirect',
          description: 'Plateforme de littérature académique peer-reviewed en sciences, technique et médecine.',
          link: 'https://www.sciencedirect.com/',
        },
        {
          name: 'DOAJ',
          description: 'Directory of Open Access Journals – revues scientifiques en libre accès.',
          link: 'https://doaj.org/',
        },
        {
          name: 'BASE',
          description: 'Moteur de recherche académique couvrant 250 M+ de documents en accès libre.',
          link: 'https://www.base-search.net/',
        },
        {
          name: 'CORE',
          description: 'Accès aux millions d’articles en libre accès d’institutions mondiales.',
          link: 'https://core.ac.uk/',
        },
        {
          name: 'WorldCat',
          description: 'Catalogue collectif mondial des collections de bibliothèques (livres, revues, médias).',
          link: 'https://www.worldcat.org/',
        },
      ],
    },
    {
      title: 'Engineering & Computer Science',
      bg: 'bg-white',
      items: [
        {
          name: 'IEEE Xplore',
          description: 'Articles et conférences en ingénierie électrique, informatique et technologies associées.',
          link: 'https://ieeexplore.ieee.org/',
        },
        {
          name: 'ACM Digital Library',
          description: 'Articles, actes de conférence et normes en informatique et sciences du numérique.',
          link: 'https://dl.acm.org/',
        },
        {
          name: 'Zotero',
          description: 'Outil gratuit de collecte et organisation de références bibliographiques.',
          link: 'https://www.zotero.org/',
        },
        {
          name: 'Mendeley',
          description: 'Gestionnaire de références et réseau social académique.',
          link: 'https://www.mendeley.com/',
        },
        {
          name: 'Overleaf',
          description: 'Éditeur LaTeX en ligne pour rédaction collaborative scientifique.',
          link: 'https://www.overleaf.com/',
        },
      ],
    },
    {
      title: 'Discipline‐Specific Archives',
      bg: 'bg-gray-50',
      items: [
        {
          name: 'arXiv',
          description: 'Prépublications en physique, mathématiques, informatique, biologie quantitative, etc.',
          link: 'https://arxiv.org/',
        },
        {
          name: 'PubMed',
          description: 'Base bibliographique en sciences de la vie et biomédecine (NCBI).',
          link: 'https://pubmed.ncbi.nlm.nih.gov/',
        },
        {
          name: 'ZB Math',
          description: 'Répertoire bibliographique pour la littérature en mathématiques.',
          link: 'https://zbmath.org/',
        },
        {
          name: 'INSPIRE-HEP',
          description: 'Archive et moteur de recherche pour la physique des hautes énergies.',
          link: 'https://inspirehep.net/',
        },
        {
          name: 'SciELO',
          description: 'Bibliothèque scientifique en ligne pour Amérique latine et Afrique lusophone.',
          link: 'https://scielo.org/',
        },
        {
          name: 'CiteSeerX',
          description: 'Moteur de recherche et archive en science de l’information et informatique.',
          link: 'http://citeseerx.ist.psu.edu/',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
        <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Useful Resources</h1>
          <p className="text-xl max-w-3xl opacity-90">
            A categorized directory of databases, journals and archives to fuel your research.
          </p>
        </div>
      </div>

      {/* Sections */}
      <main className="flex-grow">
        {categories.map((cat, i) => (
          <section key={i} className={`${cat.bg} py-12`}>
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#9a1c21] mb-6">
                {cat.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.items.map((r, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <BookOpen className="h-6 w-6 text-[#9a1c21] mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {r.name}
                        </h3>
                      </div>
                      <p className="text-gray-700 mb-4">{r.description}</p>
                      <a
                        href={r.link}
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
