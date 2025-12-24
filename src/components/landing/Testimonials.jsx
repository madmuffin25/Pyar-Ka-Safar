import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Priya & Arjun",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    quote: "We met on PyarKaSafar and instantly connected over our love for Bollywood and family values. Now we're planning our wedding!",
    rating: 5
  },
  {
    name: "Sneha & Vikram",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1598879801417-38ff6bd295a8?w=150&h=150&fit=crop",
    quote: "Finding someone who understands my Gujarati roots while living in Canada seemed impossible. PyarKaSafar made it real.",
    rating: 5
  },
  {
    name: "Anita & Raj",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    quote: "The cultural matching feature is what sets this apart. We both celebrate the same festivals and share the same food preferences!",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C46A4A] font-medium text-sm uppercase tracking-wider">Love Stories</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Real Connections, Real Love
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Hear from couples who found their perfect match on PyarKaSafar
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative bg-gradient-to-br from-[#F9F2EB] to-white rounded-3xl p-8 border border-[#C46A4A]/10 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-2 w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#D4A853] rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-4 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4A853] text-[#D4A853]" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4A853]"
                />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}