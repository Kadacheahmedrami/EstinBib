import ComplaintForm from "@/components/ComplaintForm";

export default function SubmitComplaintPage() {
  return (
    <div className="h-[92vh] overflow-y-scroll bg-gradient-to-br text-gray-700">
      <div className="max-w-4xl h-full mx-auto pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Submit a Complaint</h1>
          <p className="text-lg text-gray-400">
            We value your feedback and will address your concerns promptly
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-red-500 rounded" />
          </div>
        </div>
        <ComplaintForm />
      </div>
    </div>
  );
}
