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
  Skeleton,
} from "@chakra-ui/react";

import { SlOptionsVertical } from "react-icons/sl";
import { useState, useMemo, useEffect } from "react";
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
  const formattedNum = Num
    ? Num.toLocaleString("en-US", { useGrouping: true }).replace(/,/g, " ")
    : "0";

  return (
    <StatGroup bgGradient={background} p={4} borderRadius={"md"}>
      <Stat>
        <Flex
          textColor={"white"}
          alignItems={"center"}
          justify={"space-between"}
        >
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
  } = useGetStatistic2Query(1);

  const getData = useMemo(() => {
    if (isSuccess) return data.data;
  }, [data]);

  const CountDown = (
    p0: number,
    p1: number,
    { initialValue, duration }: { initialValue: number; duration: number }
  ) => {
    const [count, setCount] = useState(initialValue);

    useEffect(() => {
      const decrement = initialValue / (duration / 1000);
      const timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount - decrement <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - decrement;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [initialValue, duration]);

    return <>{Math.round(count)}</>;
  };

  return (
    <>
      {isLoading ? (
        <SimpleGrid
          overflowX="auto"
          columns={{ base: 2, md: 4 }}
          spacing={{ base: 2, md: 10 }}
          mb="4"
        >
          <Skeleton rounded={"md"}>
            {" "}
            <StatItem
              Label="Đơn mới hôm nay"
              Num={9999}
              background="linear-gradient(135deg, #13072e, #3f2182)"
            />
          </Skeleton>
          <Skeleton rounded={"md"}>
            {" "}
            <StatItem
              Label="Đơn mới hôm nay"
              Num={9999}
              background="linear-gradient(135deg, #13072e, #3f2182)"
            />
          </Skeleton>
          <Skeleton rounded={"md"}>
            {" "}
            <StatItem
              Label="Đơn mới hôm nay"
              Num={9999}
              background="linear-gradient(135deg, #13072e, #3f2182)"
            />
          </Skeleton>
          <Skeleton rounded={"md"}>
            {" "}
            <StatItem
              Label="Đơn mới hôm nay"
              Num={9999}
              background="linear-gradient(135deg, #13072e, #3f2182)"
            />
          </Skeleton>
        </SimpleGrid>
      ) : isError ? (
        <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          m={4}
        >
          <Alert w="50%" status="error">
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
          <StatItem
            Label="Đơn mới hôm nay"
            Num={getData.totalTodayOrders}
            background="linear-gradient(135deg, #13072e, #3f2182)"
          />
          <StatItem
            Label="Đã giao hôm nay"
            Num={getData.totalTodayDeliveries}
            background="linear-gradient(135deg, #ff2222, #ff6b00)"
          />
          <StatItem
            Label="Doanh thu"
            Num={getData.totalRevenue}
            background="linear-gradient(135deg, #0086d1, #21fa93)"
          />
          <StatItem
            Label="Đã nhận về"
            Num={Math.round((getData.totalRevenue * 3) / 4 / 100) * 100}
            background="linear-gradient(90deg, #ff5e09, #ff0348)"
          />
        </SimpleGrid>
      )}
    </>
  );
}

export default Stats;
