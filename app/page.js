import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./dashboard/_components/Header";
import Footer from "./dashboard/_components/Footer";
import { Leaf, Target, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f1] via-[#f5ebe0] to-[#f5ddd1]">
      <Header/>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        <div className="absolute inset-0 bg-[url('/patterns/botanical.svg')] opacity-5" />
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#c5d5d0] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-[#f4cdb8] rounded-[50%_50%_30%_70%/60%_40%_60%_40%] mix-blend-multiply filter blur-3xl opacity-30" style={{animationDelay: '2s'}} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-xl rounded-full shadow-soft border-2 border-[#e5d5c8]/50 mb-6 hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-[#4a6b5b] mr-2" />
              <span className="text-sm font-medium text-[#4a6b5b]">AI-Powered Interview Preparation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-normal tracking-tight">
              <span className="block text-[#1a4d4d]">Master Your Next</span>
              <span className="block text-[#2d5f5f] italic">
                Interview Journey
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#4b5563] leading-relaxed font-light">
              Practice with elegantly crafted AI questions, receive thoughtful feedback, and cultivate confidence through personalized coaching
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
              <a 
                href="/dashboard" 
                className="group inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-[#2d5f5f] hover:bg-[#1a4d4d] rounded-[28px] shadow-soft hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Begin Your Practice
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-[#2d5f5f] bg-white/80 backdrop-blur-sm rounded-[28px] border-2 border-[#e5d5c8] hover:border-[#4a6b5b] shadow-soft hover:shadow-md transition-all duration-300"
              >
                Discover More
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-[#6b7280]">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-[#4a6b5b] mr-2" />
                <span>Thoughtfully designed</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-[#4a6b5b] mr-2" />
                <span>Unlimited sessions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-[#4a6b5b] mr-2" />
                <span>Personalized guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-white/60 backdrop-blur-xl border-y-2 border-[#e5d5c8]/30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5ebe0]/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-normal text-[#1a4d4d] mb-4">
              Why Choose Our Approach?
            </h2>
            <p className="text-xl text-[#4b5563] max-w-2xl mx-auto font-light">
              Experience interview preparation designed with care and sophistication
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-10 bg-white/80 backdrop-blur-xl rounded-[40px] border-2 border-[#e5d5c8] hover:bg-white hover:shadow-lg hover:-translate-y-3 hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4a6b5b] to-[#2d4a3d] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-soft">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-display font-normal text-[#1a4d4d] mb-4">Refined Questions</h3>
              <p className="text-[#6b7280] leading-relaxed text-base">
                Thoughtfully curated interview questions tailored to your aspirations, experience, and career journey
              </p>
            </div>

            <div className="group p-10 bg-white/80 backdrop-blur-xl rounded-[40px] border-2 border-[#e5d5c8] hover:bg-white hover:shadow-lg hover:-translate-y-3 hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-[#a8b5a8] to-[#5a7d6b] rounded-[50%_50%_30%_70%/60%_40%_60%_40%] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-soft">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-display font-normal text-[#1a4d4d] mb-4">Gentle Feedback</h3>
              <p className="text-[#6b7280] leading-relaxed text-base">
                Receive considerate, constructive insights that nurture your growth and build authentic confidence
              </p>
            </div>

            <div className="group p-10 bg-white/80 backdrop-blur-xl rounded-[40px] border-2 border-[#e5d5c8] hover:bg-white hover:shadow-lg hover:-translate-y-3 hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f4cdb8] to-[#e8b4a8] rounded-[60%_40%_50%_50%/40%_60%_40%_60%] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-soft">
                <TrendingUp className="w-10 h-10 text-[#2d5f5f]" />
              </div>
              <h3 className="text-2xl font-display font-normal text-[#1a4d4d] mb-4">Graceful Progress</h3>
              <p className="text-[#6b7280] leading-relaxed text-base">
                Track your journey with elegant analytics that celebrate your improvement across practice sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-[#f5ebe0] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-normal text-[#1a4d4d] mb-4">
              Your Journey Begins
            </h2>
            <p className="text-xl text-[#4b5563] font-light">
              Three thoughtful steps to interview mastery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[40px] shadow-soft border-2 border-[#e5d5c8] hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-500">
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-[#2d5f5f] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] flex items-center justify-center text-white font-display text-2xl shadow-soft">
                  1
                </div>
                <div className="mt-4">
                  <div className="w-14 h-14 bg-[#f5ebe0] rounded-[28px] flex items-center justify-center mb-5 shadow-sm">
                    <Leaf className="w-7 h-7 text-[#4a6b5b]" />
                  </div>
                  <h3 className="text-2xl font-display font-normal text-[#1a4d4d] mb-4">Share Your Goals</h3>
                  <p className="text-[#6b7280] leading-relaxed text-base">
                    Describe your desired position, experience, and aspirations. Our AI thoughtfully crafts personalized questions
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[40px] shadow-soft border-2 border-[#e5d5c8] hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-500">
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-[#4a6b5b] rounded-[50%_50%_30%_70%/60%_40%_60%_40%] flex items-center justify-center text-white font-display text-2xl shadow-soft">
                  2
                </div>
                <div className="mt-4">
                  <div className="w-14 h-14 bg-[#f5ebe0] rounded-[28px] flex items-center justify-center mb-5 shadow-sm">
                    <Target className="w-7 h-7 text-[#4a6b5b]" />
                  </div>
                  <h3 className="text-2xl font-display font-normal text-[#1a4d4d] mb-4">Practice Mindfully</h3>
                  <p className="text-[#6b7280] leading-relaxed text-base">
                    Respond to carefully curated questions through video or text. Practice at your own gentle pace
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[40px] shadow-soft border-2 border-[#e5d5c8] hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-500">
                <div className="absolute -top-5 -left-5 w-14 h-14 bg-[#5a7d6b] rounded-[60%_40%_50%_50%/40%_60%_40%_60%] flex items-center justify-center text-white font-display text-2xl shadow-soft">
                  3
                </div>
                <div className="mt-4">
                  <div className="w-14 h-14 bg-[#f5ebe0] rounded-[28px] flex items-center justify-center mb-5 shadow-sm">
                    <TrendingUp className="w-7 h-7 text-[#4a6b5b]" />
                  </div>
                  <h3 className="text-2xl font-display font-normal text-[#1a4d4d] mb-4">Receive Insights</h3>
                  <p className="text-[#6b7280] leading-relaxed text-base">
                    Gain thoughtful feedback with nurturing guidance and model answers to refine your approach
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2d5f5f] to-[#4a6b5b] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-normal mb-6">
            Ready to Flourish?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-[#f5ebe0] font-light">
            Join thoughtful candidates who've elevated their interview presence with grace
          </p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center px-10 py-5 text-lg font-medium text-[#2d5f5f] bg-white rounded-[40px] shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            Begin Your Journey
            <ArrowRight className="ml-3 w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}