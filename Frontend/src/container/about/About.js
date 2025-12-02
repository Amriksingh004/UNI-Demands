// 📄 About.jsx
import React from 'react';
import Header from '../../components/Header';
import { motion } from 'framer-motion';

const cards = [
  {
    title: "Our Mission",
    content: "Empowering  by providing department-specific resources with seamless shopping and payment experience.",
    icon: "🎯"
  },
  {
    title: "Who We Are",
    content: "A passionate team from Himachal Pradesh building the future of Store e-commerce.",
    icon: "👨‍💻"
  },
  {
    title: "Our Vision",
    content: "Connecting education with technology to enhance learning and accessibility.",
    icon: "🌐"
  }
];

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800">
      <Header />
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-5xl font-bold mb-10 animate-pulse">About Us</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-5xl mb-4">{card.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
              <p className="text-gray-600">{card.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
