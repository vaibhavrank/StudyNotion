import React, { useState } from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart } from "react-google-charts";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const InstructorChart = ({courses}) => {

    const [currChart,setCurrChart] = useState("students");
    const getRandomColors = (numColors) => {
      const colors = [];
      for (let i = 0; i < numColors; i++) {
        const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
        colors.push(color);
      }
      return colors;
    };
    const chartDataForStudents = [
      ["Course", "Total Students Enrolled"],
      ...courses.map((course) => [course.courseName, course.totalStudentsEnrolled]),
    ];
  
    const chartDataForInstructor = [
      ["Course", "Total Amount Generated"],
      ...courses.map((course) => [course.courseName, course.totalAmountGenerated]),
    ];
    const getRandomSlices = (data) => {
      const colors = getRandomColors(data.length - 1); // Exclude header row
      return colors.map((color) => ({ color }));
    };
  
    const options = {
      // Enables 3D effect
      is3D:true,
      legend: { position: "bottom" },
      backgroundColor: "transparent", 
      slices: getRandomSlices(
        currChart === "students" ? chartDataForStudents : chartDataForInstructor
      ),
      chartArea: { width: "90%", height: "80%" },
    };
     
  return (
    <div className='flex flex-col w-full  gap-y-3'>
        <p>Visulize</p>
        <div className='flex flex-col   gap-x-3 '>
          <div className='border-b-brown-25 flex gap-x-3 border-b-2 '>
            <button
            onClick={()=>setCurrChart("students")}
            >
              Student
            </button>
            <button
            onClick={()=>setCurrChart("income")}
            >
              Income
            </button>

          </div>
          <div className='bg-richblack-100 flex justify-center mt-1'>
            <Chart
            chartType="PieChart"
            data={currChart === "students" ? chartDataForStudents : chartDataForInstructor}
            options={options}
            width={"500px"}
            height={"250px"}
            />
          </div>
        </div>
          
    </div>
  )
}

export default InstructorChart;