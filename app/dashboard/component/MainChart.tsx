import { 
  Flex, 
  Box, 
  Container, 
  Grid, 
  GridItem,
  Spinner,
  Alert,
  AlertIcon, 
} from "@chakra-ui/react";

import { ApexOptions } from "apexcharts";
import SecondChart from "./SecondChart";
import { useGetStatisticQuery } from "@/app/_lib/features/api/apiSlice";
import { useMemo } from "react";

// import Chart  from "react-apexcharts";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


interface seri {
    name: string;
    type: string;
    // color: string;
    data: number[];
  }



const ActivityChart = () => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetStatisticQuery(1)

  const getData = useMemo (() => {
    if(isSuccess) return data.data
  }, [data])

  const series :Array<seri> = [
    {
      name: "Đơn hàng",
      type: "column",
      // color: "#7a7d82",
      data: isSuccess ? getData.map((data: any) => data.totalOrder): 0,
    },
    {
      name: "Doanh thu",
      type: "line",
      // color: "#1267de",
      data: isSuccess ? getData.map((data: any) => data.totalAmount): 0,
    },
  ];

  let seriesLength = isSuccess ? getData.length : 0;
  const optimalColumnWidthPercent = 20 + (60 / (1 + 30*Math.exp(-seriesLength /3)));

  const options: ApexOptions = {
    chart: {
      id: "mixed-chart",   
      // stacked: false,
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
    
    title: {
      text: 'Báo cáo',
      align: 'left'
    },
    xaxis: {
      categories: isSuccess? getData.map((data: any) => data.monthYear): 0,
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
        title: {
          text: "Số lượng đơn",
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
        
        title: {
          text: "Tổng doanh thu",
        }, 
      },
    ],
    // plotOptions: {
    //   bar: {
    //     borderRadius: 8,
    //     columnWidth: isSuccess ? optimalColumnWidthPercent.toString() + "%" : "0%",
    //   },
    // },
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
    <>
      {isLoading ? (
          <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          >
            <Spinner size='lg' color='orange.500' />
          </Flex>
      ) : isError ? (
          <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          m={4}
          >
            <Alert w='50%' status='error'>
              <AlertIcon />
              Can not fetch data from server
            </Alert>
          </Flex>
        ) : (
          <Flex mt={4} width={{md:'80%'}}>
            <Box bgColor={'white'} p={{base: 0, md: 4}} width={'100%'} borderRadius="xl">
              <Chart
                options={options}
                series={series}
                type="line"
                width={'100%'}
                height={350}
              />
            </Box>
          </Flex>
        )}
    </>
  );
};

export default ActivityChart;
