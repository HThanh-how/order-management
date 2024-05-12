import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Box,
  SimpleGrid,
  StatGroup,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useState, useMemo } from "react";
import { useGetStatistic2Query } from "@/app/_lib/features/api/apiSlice";

interface StatItemProps {
  Label: string;
  Num: number;
  // type: number;
  // percentage: number;
  background: string;
}

function StatItem(props: StatItemProps) {
  const { Label, Num, background } = props;

  // Định dạng Num thành chuỗi với dấu cách sau mỗi ba chữ số
  const formattedNum = Num.toLocaleString('en-US', {useGrouping: true}).replace(/,/g, ' ');

  return (
    <StatGroup bgGradient={background} p={4} borderRadius={"md"}>
      <Stat>
        <Flex textColor={'white'} alignItems={"center"} justify={"space-between"}>
          <Box>
            <StatLabel>{Label}</StatLabel>
            <StatNumber>{formattedNum}</StatNumber>
          </Box>
          {/* <StatHelpText>
            <StatArrow type={type == 1 ? "increase" : "decrease"} />
            {percentage}%
          </StatHelpText> */}
        </Flex>
      </Stat>
    </StatGroup>
  );
}

function Stats() {
  const {
    data: data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetStatistic2Query(1)

  const getData = useMemo(() => {
    if (isSuccess) return data.data
  }, [data])
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
        <SimpleGrid
          overflowX="auto"
          columns={{ base: 2, md: 4 }}
          spacing={{ base: 2, md: 10 }}
        >
          <StatItem Label="Đơn mới hôm nay" Num={getData.totalTodayOrders} background="linear-gradient(135deg, #13072e, #3f2182)" />
          <StatItem Label="Đã giao hôm nay" Num={getData.totalTodayDeliveries} background="linear-gradient(135deg, #ff2222, #ff6b00)" />
          <StatItem
            Label="Doanh thu"
            Num={getData.totalRevenue}
            background="linear-gradient(135deg, #0086d1, #21fa93)"
          />
          <StatItem Label="Đã nhận về" Num={4560000} background="linear-gradient(135deg, #d8bbf9, #d532a2, #4826d1)" />
        </SimpleGrid>
      )}
    </>
  );
}

export default Stats;
