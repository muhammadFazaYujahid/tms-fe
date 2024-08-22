import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';
import HighchartsReact from 'highcharts-react-official';

import highchartsExporting from 'highcharts/modules/exporting';

if (typeof Highcharts === 'object') {
    HighchartsGantt(Highcharts); // Execute the bell curve module
}

const Ganttchart = ({ seriesData, title }) => {
    const chartRef = useRef(null);

    var today = new Date(),
        day = 1000 * 60 * 60 * 24,
        // Utility functions
        dateFormat = Highcharts.dateFormat,
        defined = Highcharts.defined,
        isObject = Highcharts.isObject;
    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    // today = today.getTime();
    useEffect(() => {
        if (chartRef.current) {
            highchartsExporting(Highcharts);
            const chart = // THE CHART
            Highcharts.ganttChart('container', {
                chart: {
                    styledMode: true
                },
                title: {
                    text: title || 'Roadmap Project'
                },
                xAxis: {
                    min: today.getTime() - (2 * day),
                    max: today.getTime() + (32 * day)
                },
                accessibility: {
                    keyboardNavigation: {
                        seriesNavigation: {
                            mode: 'serialize'
                        }
                    },
                    point: {
                        descriptionFormat: '{yCategory}. Start {x:%Y-%m-%d}, end ' +
                            '{x2:%Y-%m-%d}.'
                    }
                },
                lang: {
                    accessibility: {
                        axis: {
                            xAxisDescriptionPlural: 'The chart has a two-part X axis ' +
                                'showing time in both week numbers and days.'
                        }
                    }
                },
                series: seriesData            
                // series: [{
                //     name: 'Project 1',
                //     data: [{
                //         name: 'Planning',
                //         id: 'planning',
                //         start: today.getTime(),
                //         end: today.getTime() + (20 * day)
                //     }, {
                //         name: 'Requirements',
                //         id: 'requirements',
                //         parent: 'planning',
                //         start: today.getTime(),
                //         end: today.getTime() + (5 * day)
                //     }, {
                //         name: 'Design',
                //         id: 'design',
                //         dependency: 'requirements',
                //         parent: 'planning',
                //         start: today.getTime() + (3 * day),
                //         end: today.getTime() + (20 * day)
                //     }, {
                //         name: 'Layout',
                //         id: 'layout',
                //         parent: 'design',
                //         start: today.getTime() + (3 * day),
                //         end: today.getTime() + (10 * day)
                //     }, {
                //         name: 'Graphics',
                //         parent: 'design',
                //         dependency: 'layout',
                //         start: today.getTime() + (10 * day),
                //         end: today.getTime() + (20 * day)
                //     }, {
                //         name: 'Develop',
                //         id: 'develop',
                //         start: today.getTime() + (5 * day),
                //         end: today.getTime() + (30 * day)
                //     }, {
                //         name: 'Create unit tests',
                //         id: 'unit_tests',
                //         dependency: 'requirements',
                //         parent: 'develop',
                //         start: today.getTime() + (5 * day),
                //         end: today.getTime() + (8 * day)
                //     }, {
                //         name: 'Implement',
                //         id: 'implement',
                //         dependency: 'unit_tests',
                //         parent: 'develop',
                //         start: today.getTime() + (8 * day),
                //         end: today.getTime() + (30 * day)
                //     }]
                // }]
            });
            chart.update({
                chart: {
                    backgroundColor: '#fff',
                    style: {
                        color: '#333'
                    }
                }
            });

        }
    }, [seriesData]);
    // console.log('isi todat', today.getTime() + (5 * day))
    return <div ref={chartRef} id='container' />;
};

export default Ganttchart;