import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import styles from "./ChartCard.module.css";

export default function ChartCard() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [{ label: "Activity", data: [5,8,6,9,7], borderColor:"#0b69ff", backgroundColor:"rgba(11,105,255,0.12)", fill:true }]
      },
      options: { responsive:true, maintainAspectRatio:false }
    });
    return () => myChart.destroy();
  }, []);

  return <canvas ref={chartRef} className={styles.canvas}></canvas>;
}
