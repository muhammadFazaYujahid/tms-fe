import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';
import HighchartsReact from 'highcharts-react-official';

import highchartsExporting from 'highcharts/modules/exporting';

if (typeof Highcharts === 'object') {
    HighchartsGantt(Highcharts); // Execute the bell curve module
}

const Ganttchart = ({ seriesData }) => {
    const chartRef = useRef(null);

    var today = new Date('2023-07-19 03:29:24.371+07'),
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
    today = today.getTime();
    useEffect(() => {
        if (chartRef.current) {
            highchartsExporting(Highcharts);
            const chart = Highcharts.ganttChart(chartRef.current, {
                series: seriesData,
                tooltip: {
                    pointFormatter: function () {
                        var point = this,
                            format = '%e. %b',
                            options = point.options,
                            completed = options.completed,
                            amount = isObject(completed) ? completed.amount : completed,
                            status = ((amount || 0) * 100) + '%',
                            lines;

                        lines = [{
                            value: point.name,
                            style: 'font-weight: bold;'
                        }, {
                            title: 'Start',
                            value: dateFormat(format, point.start)
                        }, {
                            visible: !options.milestone,
                            title: 'End',
                            value: dateFormat(format, point.end)
                        }, {
                            title: 'Completed',
                            value: status
                        }, {
                            title: 'Owner',
                            value: options.owner || 'unassigned'
                        }];

                        return lines.reduce(function (str, line) {
                            var s = '',
                                style = (
                                    defined(line.style) ? line.style : 'font-size: 0.8em;'
                                );
                            if (line.visible !== false) {
                                s = (
                                    '<span style="' + style + '">' +
                                    (defined(line.title) ? line.title + ': ' : '') +
                                    (defined(line.value) ? line.value : '') +
                                    '</span><br/>'
                                );
                            }
                            return str + s;
                        }, '');
                    }
                },
                title: {
                    text: 'Gantt Project Management'
                },
                xAxis: {
                    currentDateIndicator: true,
                    min: today - 3 * day,
                    max: today + 18 * day
                },
                accessibility: {
                    keyboardNavigation: {
                        seriesNavigation: {
                            mode: 'serialize'
                        }
                    },
                    point: {
                        descriptionFormatter: function (point) {
                            var completedValue = point.completed ?
                                point.completed.amount || point.completed : null,
                                completed = completedValue ?
                                    ' Task ' + Math.round(completedValue * 1000) / 10 + '% completed.' :
                                    '',
                                dependency = point.dependency &&
                                    point.series.chart.get(point.dependency).name,
                                dependsOn = dependency ? ' Depends on ' + dependency + '.' : '';

                            return Highcharts.format(
                                point.milestone ?
                                    '{point.yCategory}. Milestone at {point.x:%Y-%m-%d}. Owner: {point.owner}.{dependsOn}' :
                                    '{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}. Owner: {point.owner}.{dependsOn}',
                                { point, completed, dependsOn }
                            );
                        }
                    }
                },
                lang: {
                    accessibility: {
                        axis: {
                            xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
                        }
                    }
                }
                // series: [
                //     {
                //         name: "Project 1",
                //         data: taskList
                //     },
                //     {
                //         name: "Project ２",
                //         data: taskList
                //     }
                // ]
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

    return <div ref={chartRef} />;
};

export default Ganttchart;