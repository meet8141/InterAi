import { SignIn } from '@clerk/nextjs'
import { Lightbulb } from 'lucide-react';


export default function Page() {
  return(
<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <section className="relative flex h-32 items-end bg-gradient-to-b from-[#1a4d4d] to-[#1a4d4d] lg:col-span-5lg:col-span-5 lg:h-full xl:col-span-6">

      <div className="hidden lg:relative lg:block lg:p-12">
        <a className="block text-white" href="#">
          <span className="sr-only">Home</span>
           <img src="/logo.svg" alt="IntervAi Logo" style={{width: "100px"}}/>
        </a>

        <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Welcome to IntervAi
        </h2>

        <p className="mt-4 leading-relaxed text-white/90 text-justify">
        The AI Interview Coach is a virtual platform designed to simulate real interview scenarios, offering personalized feedback and performance analysis. It uses AI to assess responses, improve communication skills, and provide expert-level tips. Ideal for job seekers to practice and refine their interview techniques.
        </p>
        <div className="border rounded-sm mt-4 p-2 bg-gray-800 text-white">
        <div className="flex  items-center justify-center">
        
            <h2 className="ml-2 font-bold">Guest Credentials For Login</h2>
        </div>
        <div className="flex flex-col items-center justify-center mt-2">
            <p>Email: <span className="font-semibold">guestsample@gmail.com</span></p>
            <p>Password: <span className="font-semibold">Guest@123</span></p>
        </div>
        </div>

      </div>
    </section>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <div className="relative -mt-16 block lg:hidden">
        </div>
        <SignIn />
      </div>
    </main>
  </div>
</section>
  ); 
}