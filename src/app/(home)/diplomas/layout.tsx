

export default function HomeLayout({ children }: { children: React.ReactNode }) {

  

  return (
    <div className="flex h-screen   ">
      

      {/* Right Side - Auth Forms */}
      <main className="w-full h-screen overflow-y-scroll p-5">

          {children}

      </main>
    </div>
  );
}