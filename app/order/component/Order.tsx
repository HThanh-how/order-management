import {
  Box,
  Select,
  Input,
  Text,
  Checkbox,
  Flex,
  Divider,
  Button,
  Stack,
  VStack,
  HStack,
  Container,
  InputGroup,
  InputLeftElement,
  RadioGroup,
  Radio,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tab,
  Tr,
  Th,
  TabList, Tabs,
  Td,
  TableCaption,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
  Skeleton,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import OrderTable from "./Table";

import { useGetOrdersQuery, useGetOrdersForEmployeeQuery } from "@/app/_lib/features/api/apiSlice";
// import { Order } from "@/app/type";
import { useAppSelector } from "@/app/_lib/hooks";



export default function Order() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const role = useAppSelector((state: any) => state.role.value);

  const {
    data: ordersU,
    isLoading: isLoadingU,
    isSuccess: isSuccessU,
    isError: isErrorU,
    error: errorU,
  } = useGetOrdersQuery(1, {skip: role === "ROLE_EMPLOYEE"});

  const {
    data: ordersE,
    isLoading: isLoadingE,
    isSuccess: isSuccessE,
    isError: isErrorE,
    error: errorE,
  } = useGetOrdersForEmployeeQuery(1, {skip: role !== "ROLE_EMPLOYEE"});

  const getOrders = useMemo(() => {
    if (isSuccessU) return ordersU.data;
    if (isSuccessE) return ordersE.data;
  }, [ordersU, ordersE]);

  const handleSearchInputChange = (event: { target: { value: any } }) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    if (isSuccessU || isSuccessE) {
      const filteredResults = getOrders.filter((order: any) =>
        order.code.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOrders(filteredResults);
    }
  };

  useEffect(() => {
    handleSearchInputChange({ target: { value: '' } });
  }, [ordersU, isSuccessU, ordersE, isSuccessE]);

  return (
    <TableContainer bgColor={"white"} rounded={"2xl"}>
      <Flex
        alignItems="center"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <VStack
          m={{ base: 2, md: 8 }}
          alignItems={"flex-start"}
          maxW={{ base: "80vw", md: "full" }}
        >
          <Text fontSize={{ base: "xl", md: "3xl" }} backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  backgroundClip="text"
                  color="transparent" fontWeight={700}>
            Đơn hàng
          </Text>
          <Text color={"gray"}>Bạn bán hơn 60 đơn hàng mỗi ngày</Text>
        </VStack>
        <Flex>
          <Input
            m={{ base: 2, md: 8 }}
            variant="filled"
            placeholder="Tìm mã đơn hàng"
            w={{ base: "70vw", md: "30vw" }}
            onChange={handleSearchInputChange}
          />
        </Flex>
        
      </Flex>

      {isLoadingU || isLoadingE ? (
        <Box overflowX={{ base: "scroll", md: "hidden" }} p={8} pt={0}>
        {/* <Tabs isFitted variant="enclosed" colorScheme="orange" mb={2}>
          <TabList>
            <Tab _selected={{ color: "white", bg: "linear-gradient(90deg, #ff5e09, #ff0348)" }} ><Skeleton height="20px" /></Tab>
            <Tab _selected={{ color: "white", bg: "linear-gradient(90deg, #ff5e09, #ff0348)" }} ><Skeleton height="20px" /></Tab>
            <Tab _selected={{ color: "white", bg: "linear-gradient(90deg, #ff5e09, #ff0348)" }} ><Skeleton height="20px" /></Tab>
            <Tab _selected={{ color: "white", bg: "linear-gradient(90deg, #ff5e09, #ff0348)" }} ><Skeleton height="20px" /></Tab>
            <Tab _selected={{ color: "white", bg: "linear-gradient(90deg, #ff5e09, #ff0348)" }} ><Skeleton height="20px" /></Tab>
          </TabList>
        </Tabs> */}
        <Table variant="simple" size={{ base: "sm", md: "md" }}>
          <Thead bgColor={"gray.50"} rounded={"xl"}>
            <Tr>
              <Th width={"1vw"}><Skeleton height="20px" /></Th>
              <Th><Skeleton height="20px" /></Th>
              <Th><Skeleton height="20px" /></Th>
              <Th><Skeleton height="20px" /></Th>
              <Th><Skeleton height="20px" /></Th>
              <Th><Skeleton height="20px" /></Th>
              <Th w={"1vw"}><Skeleton height="20px" /></Th>
            </Tr>
          </Thead>
          <Tbody>
            {[...Array(5)].map((_, i) => (
              <Tr key={i}>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      ) : isErrorU || isErrorE ? (
        <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
        >
          <Alert w="25%" status="error">
            <AlertIcon />
            Can not fetch data from server
          </Alert>
        </Flex>
      ) : filteredOrders.length === 0 ? (
        <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          my={12}
        >
          <Text color={'gray'} fontSize={20}>Chưa có đơn hàng nào</Text>
        </Flex>
        
      ) : (
        <OrderTable orders={filteredOrders} />
      )}
    </TableContainer>
  );
}
