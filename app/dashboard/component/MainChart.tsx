import { Flex, Box, Container } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import SecondChart from "./SecondChart";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

import Chart from 'react-apexcharts';


// const series = [
//   {
//     name: "Your Activity",
//     type: "column",
//     data: [350, 275, 375, 375, 300, 225, 275],
//   },
//   {
//     name: "Your Goal",
//     type: "line",
//     data: [400, 350, 450, 400, 350, 300, 350],
//   },
// ];

const series = [
    {
        name: 'Đơn hàng',
        type: 'column',
        data: [30, 40, 45, 50],
    },
    {
        name: 'Doanh thu',
        type: 'area',
        data: [10000, 15000, 20000, 18000],
    },
];

const chartSettings: ApexOptions = {
  colors: ["#FFCA41", "#43BC13"],
  chart: {
    // height: "30vh",
    type: "line",
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: "straight",
    width: [0, 1],
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
    style: {
      fontSize: "10px",
      fontWeight: 500,
    },
    background: {
      borderWidth: 0,
    },
  },
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  legend: {
    position: "top",
    floating: true,
  },
  xaxis: {
    type: "category",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: true,
      style: {
        colors: "#6B859E",
      },
    },
  },
  yaxis: {
    show: false,
  },
  fill: {
    type: "solid",
    opacity: 1,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
    },
  },
  grid: {
    show: false,
  },
};






const ActivityChart = () => {
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
                seriesName: 'Đơn hàng',
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
                seriesName: 'Doanh thu',
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
                    text: 'Tổng doanh thu',
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







  return (
    <Flex mt={4} justify="space-between" >
      <Box p={4} h="40vh" maxW="100%" bgColor="white" borderRadius="xl" >
        {/* <ApexCharts
          options={chartSettings}
          series={series}
          type="line"
          height={400}
          width={1400}
        /> */}
  <Chart options={options} series={series} type="line" height={400}    width={1400} />
        {/* <FirstChart/> */}
      </Box>
      <Box p={4} h="40vh" w="35%" ml={4} bgColor="white" borderRadius="xl" justifyContent={"center"} display="flex">
   
        <Box w='40vh' h="40vh" mt={4}>
        <SecondChart/></Box></Box>
     
    </Flex>
  );
};

export default ActivityChart;
