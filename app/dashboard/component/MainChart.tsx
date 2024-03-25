import { Flex, Box, Container } from "@chakra-ui/react";

import { ApexOptions } from "apexcharts";
import SecondChart from "./SecondChart";

// import Chart  from "react-apexcharts";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


interface seri {
    name: string;
    type: string;
    data: number[];
  }
  


const series :Array<seri> = [
  {
    name: "Đơn hàng",
    type: "column",
    data: [30, 40, 45, 20, 10, 16, 24, 26, 22, 30, 32, 38],
  },
  {
    name: "Doanh thu",
    type: "line",
    data: [1000000, 1500000, 2000000, 1200000, 500000, 
           530000, 800000, 1200000, 1500000, 1650000, 1800000, 2200000],
  },
];

const ActivityChart = () => {
  const options: ApexOptions = {
    chart: {
      id: "mixed-chart",
      stacked: false,
      height: 350,
      width: 800,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    stroke: {
      width: [0, 4]
    },
    markers: {
      size: 4,
    },
    // dataLabels: {
    //   enabled: true,
    //   enabledOnSeries: [1]
    // },
    title: {
      text: 'Report',
      align: 'left'
    },
    xaxis: {
      categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    yaxis: [
      {
        seriesName: "Đơn hàng",
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          style: {
            colors: "#008FFB",
          },
        },
        title: {
          text: "Số lượng đơn",
          style: {
            color: "#008FFB",
          },
        },
      },
      {
        seriesName: "Doanh thu",
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          style: {
            colors: "#00E396",
          },
        },
        title: {
          text: "Tổng doanh thu",
          style: {
            color: "#00E396",
          },
        }, 
      },
    ],
    tooltip: {
      shared: true,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
          }
        }
      }
    ]
  };

  return (
    <Flex mt={4} width={{md:1000}}>
      <Box bgColor={'white'} p={{base: 0, md:4}} width={'100%'} borderRadius="xl">
        <Chart
          options={options}
          series={series}
          type="line"
          width={'100%'}
          height={350}
        />
      </Box>
    </Flex>
  );
};

export default ActivityChart;
