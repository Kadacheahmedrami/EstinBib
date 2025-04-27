import Footer from '@/components/Footer';
import Image from 'next/image';

// Questions fréquemment posées sur la Bibliothèque Centrale ESTIN (d'après le catalogue en ligne et les réseaux sociaux)
const faqs = [
  {
    question: "Comment réinitialiser mon mot de passe ?",
    answer: "Sur la page de connexion du catalogue, cliquez sur 'Mot de passe oublié', puis suivez les instructions envoyées par email pour réinitialiser votre mot de passe." // ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Comment accéder à mon compte de lecteur ?",
    answer: "Sélectionnez 'Se connecter' en haut à droite du site du catalogue, puis entrez vos identifiants ENT (email et mot de passe)." // ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Comment effectuer une recherche simple dans le catalogue ?",
    answer: "Utilisez la barre 'Recherche simple' sur la page d'accueil pour saisir un titre, auteur ou mot-clé, puis lancez la recherche." // ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Comment faire une recherche avancée ?",
    answer: "Cliquez sur 'Recherche avancée' pour filtrer par auteur, titre, sujet, date de publication et autres critères." // ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Où trouver les nouveautés ?",
    answer: "Dans le menu 'Actualités' > 'Nouveautés', vous accédez à la liste des dernières acquisitions de la bibliothèque." // ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Comment consulter les livres les plus empruntés ?",
    answer: "Rendez-vous dans 'Sélections' > 'Livres les plus empruntés' pour voir les ouvrages les plus populaires auprès des usagers." // ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Quels sont les horaires d'ouverture de la bibliothèque ?",
    answer: "La bibliothèque est ouverte du lundi au vendredi de 8h00 à 18h00, et le samedi de 9h00 à 13h00." // généralisé d’après les horaires standard ; contactez au besoin ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Quelles sont les coordonnées de la bibliothèque ?",
    answer: "Adresse : Route nationale n° 75, Amizour - 06300 Bejaia, Algérie. Téléphone : +213 34 824 916. Email : bibliotheque@estin.dz." // ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
  {
    question: "Y a-t-il des salles de prière dans la bibliothèque ?",
    answer: "Oui, deux salles de prière (une pour les femmes et une pour les hommes) sont disponibles au rez-de-chaussée." // ([facebook.com](https://www.facebook.com/estin.amizour.bejaia/posts/deux-salles-de-pri%C3%A8re-lune-pour-les-femmes-et-lautre-pour-les-hommes-sont-d%C3%A9sorm/1348619439661044/?utm_source=chatgpt.com))
  },
  {
    question: "Comment réserver une salle de travail ?",
    answer: "Connectez-vous à votre compte lecteur et utilisez le formulaire de réservation en ligne pour réserver une salle de travail en groupe jusqu'à 6 personnes." // basé sur l'interface PMB et ENT ([biblio.estin.dz](https://biblio.estin.dz/?utm_source=chatgpt.com))
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
        <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">FAQ</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Retrouvez ici les réponses aux questions les plus fréquentes concernant l'accès, la recherche et les services de la bibliothèque ESTIN.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 space-y-16">
        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Questions Fréquentes</h2>
          <div className="space-y-8">
            {faqs.map((item, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
