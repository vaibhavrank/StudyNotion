import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Course_Card from "./Course_Card";

const CircularSlider = ({ Courses }) => {
  const radius = 150; // Adjust for a larger or smaller circle
  const duration = 10; // Time for one full rotation

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const angleStep = (2 * Math.PI) / Courses?.length; // Divide 360° by the number of courses
    const newPositions = Courses?.map((_, index) => {
      const angle = index * angleStep; // Spread elements evenly
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });
    setPositions(newPositions);
  }, [Courses]);

  return (
    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
      {positions?.length > 0 &&
        Courses.map((course, index) => (
          <motion.div
            key={index}
            className="absolute w-[100px] h-[100px] rounded-lg bg-gray-800 flex gap-8 items-center justify-center shadow-lg"
            initial={{ x: positions[index].x, y: positions[index].y }}
            animate={{
              rotate: 360, // Rotates continuously
              x: positions[index].x,
              y: positions[index].y,
            }}
            
            transition={{
              repeat: Infinity,
              duration,
              ease:"easeIn",
            }}
          >

            <Course_Card Width="w-[100px]" Height="h-[100px]" course={course} />
          </motion.div>
        ))}
    </div>
  );
};

export default CircularSlider;
