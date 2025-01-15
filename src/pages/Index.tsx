import { PoseDetectionUI } from '@/components/PoseDetectionUI';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section with Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <img 
            src="/lovable-uploads/019da9ba-4e1c-41c1-a77c-8dcea51f53b9.png" 
            alt="Phantom Reach" 
            className="h-24 md:h-32 mx-auto mb-8 object-contain hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* About Us Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="mb-16 text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold mb-8 text-gray-800"
          >
            About Us
          </motion.h1>
          
          <div className="space-y-6">
            {[
              { title: "Who We Are", content: "A multidisciplinary team trying to address unmet needs in rehabilitation for amputees." },
              { title: "Our Mission", content: "To enhance quality of life for amputees by creating accessible, engaging, and effective therapeutic solutions." },
              { title: "Our Vision", content: "To redefine rehabilitation experiences using cutting-edge technology and user-focused design." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What We Aim to Do Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="mb-16 text-center max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold mb-8 text-gray-800"
          >
            What We Aim to Do
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Empower Amputees", content: "Develop tools that promote autonomy in managing phantom limb pain and improving mobility." },
              { title: "Innovate Rehabilitation", content: "Introduce engaging, gamified solutions to traditional therapy models." },
              { title: "Bridge Gaps in Accessibility", content: "Design cost-effective solutions that work seamlessly with standard webcams and devices." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Solution Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="mb-16 text-center max-w-4xl mx-auto"
        >
          <motion.h3 
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold mb-8 text-gray-800"
          >
            Our Solution
          </motion.h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Interactive AR Therapy", content: "A gamified rehabilitation platform that uses real-time limb tracking to enhance user engagement and therapeutic outcomes." },
              { title: "Accessible and Intuitive", content: "Built for compatibility with everyday devices like standard webcams, ensuring broad accessibility." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main App UI */}
        <PoseDetectionUI />
      </div>
    </div>
  );
};

export default Index;