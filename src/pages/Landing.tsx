import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Statistics from "@/components/Statistics";
import ValueProposition from "@/components/ValueProposition";

const Landing = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto space-y-16"
        >
          {/* Logo Section */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <img 
              src="/lovable-uploads/019da9ba-4e1c-41c1-a77c-8dcea51f53b9.png" 
              alt="Phantom Reach" 
              className="h-32 mx-auto hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          {/* About Us Section */}
          <motion.div variants={itemVariants} className="text-center space-y-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600">Who We Are</h3>
                <p className="text-gray-700">A multidisciplinary team trying to address unmet needs in rehabilitation for amputees.</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600">Our Mission</h3>
                <p className="text-gray-700">To enhance quality of life for amputees by creating accessible, engaging, and effective therapeutic solutions.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Statistics Section */}
          <motion.div variants={itemVariants} className="py-8">
            <h2 className="text-3xl font-bold text-center mb-8">The Growing Need</h2>
            <Statistics />
          </motion.div>

          {/* Value Proposition Section */}
          <motion.div variants={itemVariants}>
            <ValueProposition />
          </motion.div>

          {/* What We Aim to Do Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Aim to Do</h2>
            <div className="space-y-6">
              <motion.div 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600">Empower Amputees</h3>
                <p className="text-gray-700">Develop tools that promote autonomy in managing phantom limb pain and improving mobility.</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600">Innovate Rehabilitation</h3>
                <p className="text-gray-700">Introduce engaging, gamified solutions to traditional therapy models.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Our Solution Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Solution</h2>
            <div className="space-y-6">
              <motion.div 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600">Interactive AR Therapy</h3>
                <p className="text-gray-700">A gamified rehabilitation platform that uses real-time limb tracking to enhance user engagement and therapeutic outcomes.</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600">Accessible and Intuitive</h3>
                <p className="text-gray-700">Built for compatibility with everyday devices like standard webcams, ensuring broad accessibility.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/detection")}
            >
              Start Detection
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;