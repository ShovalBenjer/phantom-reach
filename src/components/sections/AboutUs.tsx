import { motion } from "framer-motion";
import { Brain, Code2, HeartHandshake, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-12 h-12" />,
    title: "Neural Rehabilitation",
    description: "Advanced motion tracking technology helps retrain neural pathways and improve motor function."
  },
  {
    icon: <Sparkles className="w-12 h-12" />,
    title: "Engaging Experience",
    description: "Gamified rehabilitation exercises make therapy sessions more enjoyable and motivating."
  },
  {
    icon: <Code2 className="w-12 h-12" />,
    title: "Cutting-edge Tech",
    description: "Utilizing AR, computer vision, and machine learning for precise motion tracking and feedback."
  },
  {
    icon: <HeartHandshake className="w-12 h-12" />,
    title: "Patient-Centered",
    description: "Personalized rehabilitation programs adapted to individual needs and progress."
  }
];

export const AboutUs = () => {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-6">
          Revolutionizing Rehabilitation
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          PhantomReach combines cutting-edge technology with therapeutic expertise
          to create an engaging and effective rehabilitation experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg bg-card hover:bg-accent transition-colors duration-300"
          >
            <div className="mb-4 text-primary">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-20 text-center"
      >
        <h3 className="text-3xl font-bold mb-6">
          Our Mission
        </h3>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          To empower individuals in their rehabilitation journey through innovative
          technology that makes therapy more engaging, accessible, and effective.
          We believe in transforming the rehabilitation experience through the
          power of virtual gaming.
        </p>
      </motion.div>
    </div>
  );
};