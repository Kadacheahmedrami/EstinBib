// pages/pdf-unavailable.js
export default function PdfUnavailable() {
    return (
      <div className="min-h-[92vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg max-w-xl w-full">
          <h1 className="text-6xl font-extrabold text-[#F1413E] mb-6 animate__animated animate__fadeInUp">
            Oops!
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-md mx-auto">
            We don t have access to the PDF at the moment. Please try again later.
          </p>
          <button className="mt-8 px-8 py-3 bg-[#F1413E] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#e02c26] focus:outline-none focus:ring-4 focus:ring-[#F1413E] focus:ring-opacity-50 transform transition-all duration-300 ease-in-out hover:scale-105">
            Go Back
          </button>
        </div>
      </div>
    );
  }
  