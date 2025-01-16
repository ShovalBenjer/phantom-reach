import { motion } from "framer-motion";

const values = [
  { icon: "💰", title: "Affordable", description: "Cost-effective solution for all" },
  { icon: "✓", title: "Validated treatments", description: "Proven therapeutic approaches" },
  { icon: "⏱", title: "Long-term solution", description: "Sustainable rehabilitation support" },
  { icon: "🔄", title: "Non invasive", description: "Safe and non-intrusive therapy" },
  { icon: "💻", title: "No additional equipment", description: "Works with standard devices" },
  { icon: "🏠", title: "At-home solution", description: "Convenient home-based therapy" }
];

const ValueProposition = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full px-4 py-8"
    >
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Our Value Proposition</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex flex-col items-center p-4 bg-[#D3E4FD] rounded-xl transform hover:scale-105 transition-transform duration-300"
            style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
          >
            <span className="text-2xl mb-2">{value.icon}</span>
            <h3 className="text-sm font-semibold text-center mb-1">{value.title}</h3>
            <p className="text-xs text-center text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ValueProposition;