import { BookOpenCheck, Brain, FolderCode, RectangleEllipsis } from "lucide-react";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid  grid-cols-1 md:grid-cols-2 ">
      {/* Left Side - Gradient Background with Content */}
      <aside className="col-span-1 z-10 relative overflow-hidden bg-white h-screen justify-around items-center flex flex-col ">
        <div className="absolute top-14 -z-10 -right-10 w-96 h-96  rounded-full blur-3xl bg-blue-300/60 "></div>
        <div className="absolute -bottom-16 -z-10 left-0 w-96 h-96  rounded-full blur-3xl bg-blue-300/60 "></div>
        <div className="flex flex-col gap-16">
          <div className="flex items-center  gap-3 ">
          {/* Logo */}
            <div className="   rounded-lg flex items-center justify-center">
             {/* put the svg from assets/icons/folder-code.svg here */}
             <img src="/assets/icons/folder-code.svg" alt="folder-code-icon" />
            </div>
            <span className="text-blue-600 text-xl   font-bold">Exam App</span>
          </div>

        <div className="w-full max-h-md max-w-md ">

          {/* Main Heading */}
          <h1 className=" md:text-2xl font-bold text-gray-900 mb-12 leading-tight">
            Empower your learning journey with our smart exam platform.
          </h1>

          {/* Feature Sections */}
          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
                  <div className="w-10 h-10  border-2 border-blue-600 flex items-center justify-center flex-shrink-0">
               <Brain className="text-blue-600"/>
              </div>
              <div>
                <h3 className="text-blue-600 font-semibold text-xl mb-1">Tailored Diplomas</h3>
                <p className="text-gray-700">Choose from specialized tracks like Frontend, Backend, and Mobile Development.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10  border-2 border-blue-600 flex items-center justify-center flex-shrink-0">
               <BookOpenCheck className="text-blue-600"/>
              </div>
              <div>
                <h3 className="text-blue-600 font-semibold text-xl mb-1">Focused Exams</h3>
                <p className="text-gray-700">Access topic-specific tests including HTML, CSS, JavaScript, and more.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
                  <div className="w-10 h-10  border-2 border-blue-600 flex items-center justify-center flex-shrink-0">
               <RectangleEllipsis className="text-blue-600"/>
              </div>
              <div>
                <h3 className="text-blue-600 font-semibold text-xl mb-1">Smart Multi-Step Forms</h3>
                <p className="text-gray-700">Experience intuitive multi-step forms designed for seamless exam taking.</p>
              </div>
            </div>
          </div>
        </div>

        </div>
      </aside>

      {/* Right Side - Auth Forms */}
      <main className="col-span-1 flex items-center justify-center bg-white pt-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}