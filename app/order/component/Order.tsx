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
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import OrderTable from "./Table";

import { useGetOrdersQuery }  from "@/app/_lib/features/api/apiSlice"
import { Order } from "@/app/type";

const getOrders: Order[] = [
  {
    id: 1,
    code: "ORD001",
    height: 10,
    width: 5,
    length: 15,
    items: [
      { quantity: 2, price: 10, product: { id: 1, name: "Product A", photoUrl: "https://example.com/productA.jpg", status: "Available", price: 10, weight: 1, length: 10, width: 5, height: 3, description: "Description of Product A" } },
      { quantity: 1, price: 20, product: { id: 2, name: "Product B", photoUrl: "https://example.com/productB.jpg", status: "Available", price: 20, weight: 2, length: 8, width: 6, height: 4, description: "Description of Product B" } }
    ],
    store: { id: 1, name: "Store A", phoneNumber: "1234567890", address: "123 Store St", detailedAddress: "Floor 2, Room 203", description: "Description of Store A", isDefault: true, sendAtPost: true },
    receiver: { id: 1, name: "Customer X", status: "Active", phoneNumber: "9876543210", address: "789 Customer St", detailedAddress: "Unit 101", note: "Leave package at front desk.", callBeforeSend: true, receiveAtPost: false },
    price: { collectionCharge: 5, itemsPrice: 30, shippingFee: 8 },
    orderStatus: "DELIVERED",
    isDocument: false,
    isBulky: false,
    isFragile: false,
    isValuable: false,
    delivery: { payer: "Sender", hasLostInsurance: false, isCollected: false, deliveryMethod: "Standard", luuKho: "", layHang: "", giaoHang: "", shippingFee: 8, collectionFee: 0, isDraft: false, note: "" }
  },
  {
    id: 2,
    code: "ORD002",
    height: 8,
    width: 6,
    length: 12,
    items: [
      { quantity: 3, price: 15, product: { id: 3, name: "Product C", photoUrl: "https://example.com/productC.jpg", status: "Available", price: 15, weight: 1.5, length: 12, width: 6, height: 4, description: "Description of Product C" } },
      { quantity: 2, price: 25, product: { id: 4, name: "Product D", photoUrl: "https://example.com/productD.jpg", status: "Available", price: 25, weight: 3, length: 10, width: 8, height: 6, description: "Description of Product D" } },
    ],
    store: { id: 2, name: "Store B", phoneNumber: "2345678901", address: "456 Shop St", detailedAddress: "Unit 301", description: "Description of Store B", isDefault: false, sendAtPost: false },
    receiver: { id: 2, name: "Customer Y", status: "Active", phoneNumber: "8765432109", address: "987 Receiver Rd", detailedAddress: "Apt 202", note: "Call upon arrival.", callBeforeSend: true, receiveAtPost: false },
    price: { collectionCharge: 7, itemsPrice: 65, shippingFee: 10 },
    orderStatus: "PROCESSING",
    isDocument: false,
    isBulky: false,
    isFragile: false,
    isValuable: false,
    delivery: { payer: "Receiver", hasLostInsurance: false, isCollected: true, deliveryMethod: "Express", luuKho: "", layHang: "", giaoHang: "Front door", shippingFee: 10, collectionFee: 0, isDraft: false, note: "" }
  },
  {
    id: 3,
    code: "ORD003",
    height: 6,
    width: 4,
    length: 10,
    items: [
      { quantity: 1, price: 20, product: { id: 5, name: "Product E", photoUrl: "https://example.com/productE.jpg", status: "Available", price: 20, weight: 2, length: 8, width: 4, height: 3, description: "Description of Product E" } }
    ],
    store: { id: 1, name: "Store A", phoneNumber: "1234567890", address: "123 Store St", detailedAddress: "Floor 2, Room 203", description: "Description of Store A", isDefault: true, sendAtPost: true },
    receiver: { id: 3, name: "Customer Z", status: "Inactive", phoneNumber: "7654321098", address: "654 Recipient Ave", detailedAddress: "Suite 505", note: "", callBeforeSend: false, receiveAtPost: true },
    price: { collectionCharge: 5, itemsPrice: 20, shippingFee: 5 },
    orderStatus: "CANCELLED",
    isDocument: false,
    isBulky: false,
    isFragile: false,
    isValuable: false,
    delivery: { payer: "Receiver", hasLostInsurance: false, isCollected: true, deliveryMethod: "Standard", luuKho: "", layHang: "", giaoHang: "Mailroom", shippingFee: 5, collectionFee: 0, isDraft: false, note: "" }
  },
  // Add more dummy orders here...
];



export default function Order() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  // const {
  //   data: orders,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetOrdersQuery()

  // const getOrders = useMemo (() => {
  //   if(isSuccess) return orders.data
  // }, [orders])

  const handleSearchInputChange = (event: { target: { value: any } }) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    // if(isSuccess) {
    //   const filteredResults = getOrders.filter(
    //     (order: any) =>
    //       // order.code.toLowerCase().includes(inputValue.toLowerCase())
    //       order.id === inputValue
    //   );
    //   setFilteredOrders(filteredResults);
    // }
    const filteredResults = getOrders.filter(
      (order: any) =>
        order.code.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOrders(filteredResults);
  };

  useEffect(() => {
    handleSearchInputChange({ target: { value: '' } });
  }, []);

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
          <Text fontSize={{ base: "xl", md: "3xl" }} fontWeight={700}>
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
        {/* <Dialog /> */}
      </Flex>
      
        {/* {isLoading ? (
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
          >
            <Alert w='25%' status='error'>
              <AlertIcon />
              Can not fetch data from server
            </Alert>
          </Flex>
        ) : (
        <OrderTable orders={getOrders} />
        )} */}
        <OrderTable orders={getOrders} />
        
    </TableContainer>
  );
}
