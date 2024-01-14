import { Flex, Box, Container } from "@chakra-ui/react";

import { ApexOptions } from "apexcharts";
import SecondChart from "./SecondChart";

import Chart from "react-apexcharts";



interface seri {
    name: string;
    type: string;
    data: number[];
  }
  


const series :Array<seri> = [
  {
    name: "Đơn hàng",
    type: "column",
    data: [30, 40, 45, 50],
  },
  {
    name: "Doanh thu",
    type: "area",
    data: [10000, 15000, 20000, 18000],
  },
];

const ActivityChart = () => {
//   const options: ApexOptions = {
//     chart: {
//       id: "mixed-chart",
//       stacked: false,
//     },
//     xaxis: {
//       categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
//     },
//     yaxis: [
//       {
//         seriesName: "Đơn hàng",
//         axisTicks: {
//           show: true,
//         },
//         axisBorder: {
//           show: true,
//         },
//         labels: {
//           style: {
//             colors: "#008FFB",
//           },
//         },
//         title: {
//           text: "Quantity of Orders",
//           style: {
//             color: "#008FFB",
//           },
//         },
//       },
//       {
//         seriesName: "Doanh thu",
//         opposite: true,
//         axisTicks: {
//           show: true,
//         },
//         axisBorder: {
//           show: true,
//         },
//         labels: {
//           style: {
//             colors: "#00E396",
//           },
//         },
//         title: {
//           text: "Tổng doanh thu",
//           style: {
//             color: "#00E396",
//           },
//         },
//       },
//     ],
//     tooltip: {
//       shared: true,
//     },
//   };

  return (
    <Flex mt={4} justify="space-between">
      <Box p={4} h="40vh" maxW="100%" bgColor="white" borderRadius="xl">
        {/* <ApexCharts
          options={chartSettings}
          series={series}
          type="line"
          height={400}
          width={1400}
        /> */}
        {/* <Chart
          options={options}
          series={series}
          type="line"
          height={400}
          width={1400}
        /> */}
        {/* <FirstChart/> */}
      </Box>
      <Box
        p={4}
        h="40vh"
        w="35%"
        ml={4}
        bgColor="white"
        borderRadius="xl"
        justifyContent={"center"}
        display="flex"
      >
        <Box w="40vh" h="40vh" mt={4}>
          <SecondChart />
        </Box>
      </Box>
    </Flex>
  );
};

export default ActivityChart;
