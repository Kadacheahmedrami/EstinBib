"use client"
import React, { useState } from "react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Person {
  title: string;
  name: string;
  children?: Person[];
}

interface NodeCardProps {
  node: Person;
  level?: number;
  isLast?: boolean;
}

const people: Person[] = [
  {
    title: "Directeur de l'école",
    name: "Pr. TARI Abdelkamel",
    children: [
      {
        title: "Directeur adjoint chargé des enseignements, des diplômes et de la formation continue",
        name: "Dr. Bensaid",
        children: [
          { title: "Chef de service des enseignements, des stages et de l'évaluation", name: "M. Ziani" },
          { title: "Chef de service de la formation continue ou initiale", name: "Mme. Hamdi" },
          { title: "Chef de service des diplômes", name: "M. Boutaleb" },
        ],
      },
      {
        title: "Directeur adjoint chargé de la formation doctorale et de la recherche scientifique",
        name: "Dr. Belkacem",
        children: [
          { title: "Chef de service de la formation de troisième cycle", name: "Dr. Aouadi" },
          { title: "Chef de service du suivi des activités de recherche et de la valorisation", name: "Dr. Khelifi" },
          { title: "Chef de service de l'innovation et de la promotion de l'entrepreneuriat", name: "Mme. Kaidi" },
        ],
      },
      {
        title: "Directeur adjoint chargé des systèmes d'information, communication et relations extérieures",
        name: "Dr. Hachimi",
        children: [
          { title: "Chef de service de l'information et de la communication", name: "M. Loucif" },
          { title: "Chef de service de la veille, des statistiques et de la prospective", name: "Mme. Boussafa" },
          { title: "Chef de service des relations extérieures", name: "M. Merabet" },
        ],
      },
      {
        title: "Secrétaire général",
        name: "Dr. Rebaine",
        children: [
          {
            title: "Sous-directeur des personnels, de la formation et des activités culturelles et sportives",
            name: "Mme. Dendane",
            children: [
              { title: "Chef de service des personnels enseignants", name: "Dr. Saadi" },
              { title: "Chef de service des personnels administratifs, techniques et agents de service", name: "M. Kadi" },
              { title: "Chef de service des activités culturelles et sportives", name: "Mme. Belhocine" },
              { title: "Chef de service des affaires juridiques et du contentieux", name: "Dr. Amrane" },
            ],
          },
          {
            title: "Sous-directeur des finances et des moyens",
            name: "M. Benabdallah",
            children: [
              { title: "Chef de service du budget et du financement des activités de la recherche", name: "Dr. Zerrouki" },
              { title: "Chef de service des marchés et des équipements", name: "M. Tahar" },
              { title: "Chef de service des moyens, de l'inventaire et des archives", name: "Mme. Lounis" },
              { title: "Chef de service de l'entretien et de la maintenance des biens", name: "M. Bouhadjar" },
            ],
          },
          { title: "Chef de service des œuvres universitaires", name: "Mme. Lahmar" },
        ],
      },
      {
        title: "Directeur de la bibliothèque",
        name: "Mme. Zergui",
        children: [
          { title: "Chef de service de l'acquisition et du traitement", name: "M. Selmi" },
          { title: "Chef de service de la recherche bibliographique", name: "Dr. Chekib" },
          { title: "Chef de service de l'accueil et de l'orientation", name: "Mme. Nadji" },
        ],
      },
      {
        title: "Chef de département",
        name: "Pr. Boudjema",
        children: [
          { title: "Chef de service de la formation classe préparatoire ou second cycle", name: "Mme. Boukhelfa" },
          { title: "Chef de service de la formation de troisième cycle et des activités de la recherche scientifique", name: "Dr. Ferhat" },
          { title: "Directeurs des laboratoires et/ou unités de recherche", name: "Dr. Mellal" },
        ],
      },
    ],
  },
];

const OrganigrammeEstin = () => {
  const NodeCard: React.FC<NodeCardProps> = ({ node, level = 0, isLast = false }) => {
    const [expanded, setExpanded] = useState(level < 1);
    const hasChildren = node.children && node.children.length > 0;
    
    // Dynamic styling based on level
    const getCardStyle = () => {
      const baseStyle = "relative flex items-center gap-4 p-4 rounded-lg transition-all duration-300";
      const levelStyles = {
        0: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:shadow-red-500/25",
        1: "bg-gradient-to-r from-red-500 to-red-400 text-white shadow-md hover:shadow-red-400/20",
        2: "bg-gradient-to-r from-red-400 to-red-300 text-white shadow hover:shadow-red-300/15"
      };
      
      return `${baseStyle} ${levelStyles[level as keyof typeof levelStyles] || levelStyles[2]}`;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: level * 0.1 }}
        className="w-full"
      >
        <div className={getCardStyle()}>
          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-white/10 rounded-full">
                <User size={level === 0 ? 20 : 16} className="text-white" />
              </div>
              <h3 className="font-semibold text-white">
                {node.name}
              </h3>
            </div>
            <p className="text-sm text-white/90">
              {node.title}
            </p>
          </div>

          {/* Expand/Collapse button */}
          {hasChildren && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {expanded ? (
                <ChevronUp size={20} className="text-white" />
              ) : (
                <ChevronDown size={20} className="text-white" />
              )}
            </button>
          )}
        </div>

        {/* Children container with animations */}
        <AnimatePresence>
          {expanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative ml-6 mt-4 space-y-4"
            >
              {/* Vertical connection line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-red-400/50 to-red-300/20" />

              {/* Children nodes */}
              {node.children?.map((child, idx) => (
                <div key={idx} className="relative pl-8">
                  {/* Horizontal connection line */}
                  <div className="absolute left-0 top-1/2 w-6 h-px bg-gradient-to-r from-red-400/50 to-red-300/20" />
                  <NodeCard
                    node={child}
                    level={level + 1}
                    isLast={idx === (node.children?.length ?? 0) - 1}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className=" h-full overflow-y-scroll bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-8">
          Organigramme de l'ESTIN
        </h1>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <NodeCard node={people[0]} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-gray-500"
        >
          <p>Cliquez sur les flèches pour développer ou réduire les sections</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrganigrammeEstin;