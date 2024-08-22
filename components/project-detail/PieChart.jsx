import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function PieChart({ option, colors, seriesData }) {
    const defaultColors = ['#BADA55', '#FFF8E1']; // Define your default colors here

    const options = {
        title: {
            text: 'Task Distribution Chart'
        },
        chart: {
            type: 'pie',
        },
        plotOptions: {
            pie: {
                // colors: colors || defaultColors, // Use the passed colors prop or default colors
            }
        },
        series: [
            {
                data: seriesData.map(data => ({ name: data.status_name, y: Number(data.task_count), color: '#BADA55' })) || 
                      [{ name: "Open", y: 70 }, { name: "Pending", y: 80 }, { name: "Cancel", y: 40 }, { name: "Paid", y: 170 }]
            }
        ]
    };

    const finalOptions = option ? { ...options, ...option } : options;

    return (
        <HighchartsReact highcharts={Highcharts} options={finalOptions} />
    );
}

export default PieChart;
