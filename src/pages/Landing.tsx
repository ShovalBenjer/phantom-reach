import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto space-y-12"
        >
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

          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">About Us</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Who We Are</h3>
                <p className="text-gray-700 dark:text-gray-300">A multidisciplinary team trying to address unmet needs in rehabilitation for amputees.</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Our Mission</h3>
                <p className="text-gray-700 dark:text-gray-300">To enhance quality of life for amputees by creating accessible, engaging, and effective therapeutic solutions.</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">What We Aim to Do</h2>
            <div className="space-y-6">
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Empower Amputees</h3>
                <p className="text-gray-700 dark:text-gray-300">Develop tools that promote autonomy in managing phantom limb pain and improving mobility.</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Innovate Rehabilitation</h3>
                <p className="text-gray-700 dark:text-gray-300">Introduce engaging, gamified solutions to traditional therapy models.</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Solution</h2>
            <div className="space-y-6">
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Interactive AR Therapy</h3>
                <p className="text-gray-700 dark:text-gray-300">A gamified rehabilitation platform that uses real-time limb tracking to enhance user engagement and therapeutic outcomes.</p>
              </motion.div>
              <motion.div 
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Accessible and Intuitive</h3>
                <p className="text-gray-700 dark:text-gray-300">Built for compatibility with everyday devices like standard webcams, ensuring broad accessibility.</p>
              </motion.div>
            </div>
          </motion.div>

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