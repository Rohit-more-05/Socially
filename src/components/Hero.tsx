import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Heart, MessageCircle, Camera } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,92,246,0.2),transparent_70%)]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              AnchorSpace
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect, share, and discover in a new social experience. Follow friends, 
            share moments, and build meaningful connections.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg group">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg">
            Learn More
          </Button>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in">
          <div className="flex flex-col items-center p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800">
            <Users className="h-8 w-8 text-purple-400 mb-2" />
            <span className="text-sm text-gray-300">Follow Friends</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800">
            <Heart className="h-8 w-8 text-red-400 mb-2" />
            <span className="text-sm text-gray-300">Like Posts</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800">
            <MessageCircle className="h-8 w-8 text-blue-400 mb-2" />
            <span className="text-sm text-gray-300">Comment</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800">
            <Camera className="h-8 w-8 text-green-400 mb-2" />
            <span className="text-sm text-gray-300">Share Photos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;