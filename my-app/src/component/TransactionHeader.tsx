interface Header {
  title: string;
  subtitle?: string;
}

const TransactionHeader = ({ title, subtitle }: Header) => {
  return (
    <div>
      {title && (
        <div className="relative bg-white overflow-hidden">
          {/* Top gradient border with enhanced design */}

          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 -top-10 h-40 w-40 bg-blue-100 rounded-full opacity-20 blur-3xl" />
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-purple-100 rounded-full opacity-20 blur-3xl" />
          </div>

          <div className="px-8  relative">
            <div className="max-w-7xl mx-auto">
              {/* Enhanced title section */}
              <div className="relative">
                {/* Main title content */}
                <div className="relative text-center py-4">
                  {/* Subtle background card effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)]" />

                  {/* Title content */}
                  <div className="relative">
                    <h1 className="text-5xl font-bold mb-4">
                      <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-100 bg-clip-text text-transparent">
                        {title}
                      </span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                      {subtitle}
                    </p>
                  </div>

                  {/* Decorative lines */}
                  <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHeader;
