import React, { useState } from 'react';
import { Chart } from "react-google-charts";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const InstructorChart = ({ courses }) => {
    const [currChart, setCurrChart] = useState("students");

    // Function to get random colors in hexadecimal format
    const getRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            // Generate a random hexadecimal color
            // This ensures a valid hex string like "#RRGGBB"
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
            colors.push(color);
        }
        return colors;
    };

    const chartDataForStudents = [
        ["Course", "Total Students Enrolled"],
        ...courses.map((course) => [course.courseName, course.totalStudentsEnrolled]),
    ];

    const chartDataForIncome = [
        ["Course", "Total Amount Generated"],
        ...courses.map((course) => [course.courseName, course.totalAmountGenerated]),
    ];

    // Get the random colors once, based on the number of courses
    const randomChartColors = getRandomColors(courses.length);

    const options = {
        is3D: true,
        legend: { position: "bottom", textStyle: { color: '#E4E6EB' } },
        backgroundColor: "transparent",
        pieSliceBorderColor: '#161d29',
        // Map the random colors to the slices
        slices: randomChartColors.map(color => ({ color })),
        chartArea: { width: "95%", height: "80%" },
        title: currChart === "students" ? "Student Engagement" : "Revenue Breakdown",
        titleTextStyle: { color: '#F1F2FF', fontSize: 18, bold: true },
    };

    return (
        <div className='flex flex-col w-full rounded-md bg-richblack-800 p-6 shadow-sm h-full'>
            <h2 className='text-lg font-semibold text-richblack-50 mb-4'>Visualize</h2>

            <div className='flex p-1 bg-richblack-700 rounded-full max-w-max mx-auto mb-6'>
                <button
                    onClick={() => setCurrChart("students")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${currChart === "students" ? 'bg-richblack-900 text-yellow-50' : 'text-richblack-200 hover:text-richblack-50'}`}
                >
                    Students
                </button>
                <button
                    onClick={() => setCurrChart("income")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${currChart === "income" ? 'bg-richblack-900 text-yellow-50' : 'text-richblack-200 hover:text-richblack-50'}`}
                >
                    Income
                </button>
            </div>

            <div className='flex-1 flex justify-center items-center bg-richblack-900 rounded-md p-4'>
                <Chart
                    chartType="PieChart"
                    data={currChart === "students" ? chartDataForStudents : chartDataForIncome}
                    options={options}
                    width={"100%"}
                    height={"100%"}
                />
            </div>
        </div>
    );
};

export default InstructorChart;