import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";

const SecondChart = () => {
    const options: ApexOptions = {
        labels: [
            'Đơn nháp',
            'Đang lấy hàng',
            'Đang vận chuyển',
            'Đang giao hàng',
            'Chờ phát lại',
            'Giao thành công',
            'Chờ xử lý'
        ],
        colors: [
            '#A6A6A6',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#FF9F40',
            '#7ED957',
            '#FF6384'
        ],
        legend: {
            position: 'bottom'
        }
    };

    const series = [10, 20, 30, 15, 5, 25, 12];

    return (
        <div>
            <h2>Tổng đơn đang hoạt động</h2>
            <Chart options={options} series={series} type="donut" />
        </div>
    );
};

export default SecondChart;
