
import { ExternalLink, BookOpen, FileText, Video, Download } from "lucide-react"
import Footer from '@/components/Footer'
export default function RessourcesUtilesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
     

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
      <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Useful Resources</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Explore a curated collection of valuable resources to support your academic and research endeavors
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 space-x-4">
            <button className="px-4 py-2 rounded-full bg-[#9a1c21] text-white text-sm font-medium whitespace-nowrap">
              All Resources
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-gray-700 border text-sm font-medium whitespace-nowrap">
              E-Books
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-gray-700 border text-sm font-medium whitespace-nowrap">
              Journals
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-gray-700 border text-sm font-medium whitespace-nowrap">
              Research Papers
            </button>
            <button className="px-4 py-2 rounded-full bg-white text-gray-700 border text-sm font-medium whitespace-nowrap">
              Video Tutorials
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Online Databases & Journals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resource Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">IEEE Xplore Digital Library</h3>
                  <p className="text-gray-600 mb-4">Access to technical literature in engineering and technology.</p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <BookOpen className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Journal
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Engineering
                </span>
              </div>
              <a
                href="https://ieeexplore.ieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Resource Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">ACM Digital Library</h3>
                  <p className="text-gray-600 mb-4">
                    Full-text collection of articles and bibliographic literature in computing.
                  </p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <BookOpen className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Journal
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Computer Science
                </span>
              </div>
              <a
                href="https://dl.acm.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Resource Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">ScienceDirect</h3>
                  <p className="text-gray-600 mb-4">Leading platform of peer-reviewed scholarly literature.</p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <BookOpen className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Journal
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Multidisciplinary
                </span>
              </div>
              <a
                href="https://www.sciencedirect.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-8">E-Learning Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resource Card 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Coursera</h3>
                  <p className="text-gray-600 mb-4">Online courses from top universities and companies worldwide.</p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <Video className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Courses
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Multidisciplinary
                </span>
              </div>
              <a
                href="https://www.coursera.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Resource Card 5 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">edX</h3>
                  <p className="text-gray-600 mb-4">Free online courses from Harvard, MIT, and more.</p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <Video className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Courses
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Multidisciplinary
                </span>
              </div>
              <a
                href="https://www.edx.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Resource Card 6 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">MIT OpenCourseWare</h3>
                  <p className="text-gray-600 mb-4">Free web-based publication of MIT course content.</p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <FileText className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Course Materials
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Engineering
                </span>
              </div>
              <a
                href="https://ocw.mit.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-8">Research Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resource Card 7 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Zotero</h3>
                  <p className="text-gray-600 mb-4">
                    Free, easy-to-use tool to help you collect and organize research.
                  </p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <Download className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Software
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Reference Management
                </span>
              </div>
              <a
                href="https://www.zotero.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Resource Card 8 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Mendeley</h3>
                  <p className="text-gray-600 mb-4">Reference manager and academic social network.</p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <Download className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Software
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Reference Management
                </span>
              </div>
              <a
                href="https://www.mendeley.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Resource Card 9 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Overleaf</h3>
                  <p className="text-gray-600 mb-4">Online LaTeX editor for collaborative scientific writing.</p>
                </div>
                <div className="bg-red-50 p-2 rounded-full">
                  <FileText className="h-6 w-6 text-[#9a1c21]" />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-red-50 text-[#9a1c21] text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Tool
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Document Preparation
                </span>
              </div>
              <a
                href="https://www.overleaf.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9a1c21] font-medium flex items-center hover:underline"
              >
                Access Resource
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

     <Footer />
    </div>
  )
}
