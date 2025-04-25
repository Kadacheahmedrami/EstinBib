import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Footer from "@/components/Footer"

export default function FormationsPage() {
  return (
    <div className="min-h-screen bg-white">
    

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#9a1c21] to-[#c13b42] text-white">
      <div className="absolute inset-0 bg-[url('/jpg/hero.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Formations</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Discover specialized training programs offered by ESTIN Library to enhance your academic and professional skills
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Formation Card 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl group">
            <div className="h-40 bg-gradient-to-br from-[#9a1c21] to-[#c13b42] relative">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] bg-cover bg-center opacity-40"></div>
              <div className="absolute top-4 left-4 bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-[#9a1c21]">
                Popular
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Research Methodology Workshop</h3>
              <p className="text-gray-600 mb-4">
                Learn essential research skills, from formulating research questions to analyzing data.
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Next session: May 15, 2025</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>Duration: 3 weeks (6 sessions)</span>
              </div>
              <button className="text-[#9a1c21] font-medium flex items-center group-hover:underline">
                Register now
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Formation Card 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl group">
            <div className="h-40 bg-gradient-to-br from-[#9a1c21] to-[#c13b42] relative">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] bg-cover bg-center opacity-40"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Library Resources</h3>
              <p className="text-gray-600 mb-4">
                Master the use of digital databases, e-journals, and online research tools.
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Next session: June 2, 2025</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>Duration: 1 week (2 sessions)</span>
              </div>
              <button className="text-[#9a1c21] font-medium flex items-center group-hover:underline">
                Register now
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Formation Card 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl group">
            <div className="h-40 bg-gradient-to-br from-[#9a1c21] to-[#c13b42] relative">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=600')] bg-cover bg-center opacity-40"></div>
              <div className="absolute top-4 left-4 bg-white/90 rounded-full px-3 py-1 text-xs font-medium text-[#9a1c21]">
                New
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Writing & Citation</h3>
              <p className="text-gray-600 mb-4">
                Improve your academic writing skills and learn proper citation methods.
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Next session: May 20, 2025</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>Duration: 2 weeks (4 sessions)</span>
              </div>
              <button className="text-[#9a1c21] font-medium flex items-center group-hover:underline">
                Register now
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
     
          <div className="bg-gradient-to-r from-[#9a1c21] to-[#c13b42] rounded-xl p-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Request a Custom Formation</h2>
              <p className="text-white/90 mb-6">
                Don t see what you re looking for? We can create custom training programs for your needs.
              </p>
              <button className="px-6 py-3 bg-white text-[#9a1c21] font-medium rounded-lg hover:bg-gray-100">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

  
      <Footer />
    </div>
  )
}
