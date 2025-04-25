"use client"

import { useState, ReactElement } from "react"
import { ChevronDown, ChevronRight } from 'lucide-react'

interface OrgNode {
  id: string;
  title: string;
  bgColor: string;
  children?: OrgNode[];
}

export default function OrganizationalChart() {
  return (
    <div className="min-h-screen  ">
         <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
        <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">organigramme</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
          ESTIN Organizational Chart
          </p>
        </div>
      </div>
      <div className="mx-auto  container">
        <OrgTree />
      </div>
    </div>
  )
}

function OrgTree() {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    director: true,
    // All other nodes start collapsed by default
  })

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }

  const orgData: OrgNode = {
    id: "director",
    title: "Directeur de l'école",
    bgColor: "bg-rose-200",
    children: [
      {
        id: "deputy1",
        title: "Directeur adjoint chargé des enseignements, des diplômes et de la formation continue",
        bgColor: "bg-blue-100",
        children: [
          {
            id: "service1",
            title: "Chef de service des enseignements, des stages et de l'évaluation",
            bgColor: "bg-blue-50",
          },
          {
            id: "service2",
            title: "Chef de service de la formation continue ou initiale",
            bgColor: "bg-blue-50",
          },
          {
            id: "service3",
            title: "Chef de service des diplômes",
            bgColor: "bg-blue-50",
          },
        ],
      },
      {
        id: "deputy2",
        title: "Directeur adjoint chargé de la formation doctorale et de la recherche scientifique",
        bgColor: "bg-blue-100",
        children: [
          {
            id: "service4",
            title: "Chef de service de la formation de troisième cycle",
            bgColor: "bg-blue-50",
          },
          {
            id: "service5",
            title: "Chef de service du suivi des activités de recherche et de la valorisation",
            bgColor: "bg-blue-50",
          },
          {
            id: "service6",
            title: "Chef de service de l'innovation et de la promotion de l'entrepreneuriat",
            bgColor: "bg-blue-50",
          },
        ],
      },
      {
        id: "deputy3",
        title: "Directeur adjoint chargé des systèmes d'information, communication et relations extérieures",
        bgColor: "bg-blue-100",
        children: [
          {
            id: "service7",
            title: "Chef de service de l'information et de la communication",
            bgColor: "bg-blue-50",
          },
          {
            id: "service8",
            title: "Chef de service de la veille, des statistiques et de la prospective",
            bgColor: "bg-blue-50",
          },
          {
            id: "service9",
            title: "Chef de service des relations extérieures",
            bgColor: "bg-blue-50",
          },
        ],
      },
      {
        id: "secretary",
        title: "Secrétaire général",
        bgColor: "bg-blue-100",
        children: [
          {
            id: "subdir1",
            title: "Sous-directeur des personnels, de la formation et des activités culturelles et sportives",
            bgColor: "bg-blue-50",
            children: [
              {
                id: "service10",
                title: "Chef de service des personnels enseignants",
                bgColor: "bg-slate-100",
              },
              {
                id: "service11",
                title: "Chef de service des personnels administratifs, techniques et agents de service",
                bgColor: "bg-slate-100",
              },
              {
                id: "service12",
                title: "Chef de service des activités culturelles et sportives",
                bgColor: "bg-slate-100",
              },
              {
                id: "service13",
                title: "Chef de service des affaires juridiques et du contentieux",
                bgColor: "bg-slate-100",
              },
            ],
          },
          {
            id: "subdir2",
            title: "Sous-directeur des finances et des moyens",
            bgColor: "bg-blue-50",
            children: [
              {
                id: "service14",
                title: "Chef de service du budget et du financement des activités de la recherche",
                bgColor: "bg-slate-100",
              },
              {
                id: "service15",
                title: "Chef de service des marchés et des équipements",
                bgColor: "bg-slate-100",
              },
              {
                id: "service16",
                title: "Chef de service des moyens, de l'inventaire et des archives",
                bgColor: "bg-slate-100",
              },
              {
                id: "service17",
                title: "Chef de service de l'entretien et de la maintenance des biens",
                bgColor: "bg-slate-100",
              },
            ],
          },
          {
            id: "service18",
            title: "Chef de service des œuvres universitaires",
            bgColor: "bg-blue-50",
          },
        ],
      },
      {
        id: "library",
        title: "Directeur de la bibliothèque",
        bgColor: "bg-blue-100",
        children: [
          {
            id: "service19",
            title: "Chef de service de l'acquisition et du traitement",
            bgColor: "bg-blue-50",
          },
          {
            id: "service20",
            title: "Chef de service de la recherche bibliographique",
            bgColor: "bg-blue-50",
          },
          {
            id: "service21",
            title: "Chef de service de l'accueil et de l'orientation",
            bgColor: "bg-blue-50",
          },
        ],
      },
      {
        id: "department",
        title: "Chef de département",
        bgColor: "bg-blue-100",
        children: [
          {
            id: "service22",
            title: "Chef de service de la formation classe préparatoire ou second cycle",
            bgColor: "bg-blue-50",
          },
          {
            id: "service23",
            title: "Chef de service de la formation de troisième cycle et des activités de la recherche scientifique",
            bgColor: "bg-blue-50",
          },
          {
            id: "service24",
            title: "Directeurs des laboratoires et/ou unités de recherche",
            bgColor: "bg-blue-50",
          },
        ],
      },
    ],
  }

  const renderNode = (node: OrgNode, level: number = 0, isLastChild: boolean = false): ReactElement => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes[node.id]

    return (
      <div key={node.id} className={`relative ${isLastChild ? 'last-child' : ''}`}>
        <div className="flex items-center">
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="mr-2 flex h-5 w-5 items-center justify-center rounded-sm hover:bg-slate-200"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="connector-dot"></div>
          )}
          <div className={`node-box my-1 rounded-md   px-4 py-2 shadow-sm ${node.bgColor}`}>
            <span className="font-medium">{node.title}</span>
          </div>
        </div>

        {hasChildren && isExpanded && node.children && (
          <div className="children-container">
            {node.children.map((child: OrgNode, index: number) => 
              renderNode(child, level + 1, index === node!.children!.length - 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="org-chart rounded-lg   p-6 ">
      {renderNode(orgData)}
    </div>
  )
}
