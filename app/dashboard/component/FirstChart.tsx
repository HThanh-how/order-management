import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";

const FirstChart = () => {
    const options: ApexOptions = {
        chart: {
            id: 'mixed-chart',
            stacked: false,
        },
        xaxis: {
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        },
        yaxis: [
            {
                seriesName: 'Orders',
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                },
                labels: {
                    style: {
                        colors: '#008FFB',
                    },
                },
                title: {
                    text: 'Quantity of Orders',
                    style: {
                        color: '#008FFB',
                    },
                },
            },
            {
                seriesName: 'Revenue',
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                },
                labels: {
                    style: {
                        colors: '#00E396',
                    },
                },
                title: {
                    text: 'Total Revenue',
                    style: {
                        color: '#00E396',
                    },
                },
            },
        ],
        tooltip: {
            shared: true,
        },
    };

    const series = [
        {
            name: 'Orders',
            type: 'column',
            data: [30, 40, 45, 50],
        },
        {
            name: 'Revenue',
            type: 'area',
            data: [10000, 15000, 20000, 18000],
        },
    ];

    return (
        <div>
            <Chart options={options} series={series} type="line" height={350} />
        </div>
    );
};

export default FirstChart;
