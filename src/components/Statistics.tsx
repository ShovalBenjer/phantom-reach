import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2024', Amputees: 2000, PLPSuffering: 1500 },
  { year: '2030', Amputees: 2500, PLPSuffering: 2000 },
  { year: '2040', Amputees: 3000, PLPSuffering: 2500 },
  { year: '2050', Amputees: 3500, PLPSuffering: 3000 },
];

const Statistics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full h-[400px] p-4 bg-white rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-bold text-center mb-4 text-gray-800">US Citizens Affected (in thousands)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Amputees" fill="#60A5FA" />
          <Bar dataKey="PLPSuffering" fill="#818CF8" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default Statistics;