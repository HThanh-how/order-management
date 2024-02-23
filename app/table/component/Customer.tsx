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
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import Dialog from "./Dialog";
import CustomerList from "./Table";

type Customer = {
  id: number;
  name: string;
  status: string;
  tags: string[];
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  note: string;
};

export default function CustomerTable() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [customers, setCustomers] = useState<any>([]);
  const firstUpdate = useRef(true);

  useEffect(() => {
    const getReceivers = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/receivers`, 
                  {
                    method: 'GET',
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                      "userId": `${localStorage.getItem("userId")}`,
                    }
                  
                  })
      .then(data => data.json())
      .then(processedData => setCustomers(processedData.data))
      .catch(error => console.log(error))

    }

    if (firstUpdate.current) {
      firstUpdate.current = false;
      getReceivers();
      return;
    }
    
    console.log(customers);
    handleSearchInputChange({ target: { value: '' } });
  }, [customers]);

  const handleSearchInputChange = (event: { target: { value: any } }) => {

    const inputValue = event.target.value;
    setSearchInput(inputValue);

    // console.log(inputValue)
    const filteredResults = customers.filter(
      (customer: any) =>
        customer.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        customer.phoneNumber.includes(inputValue)
    );
    setFilteredCustomers(filteredResults);
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
            Khách hàng
          </Text>
          <Text color={"gray"}>Tuần này bạn có thêm 20 khách hàng mới</Text>
        </VStack>
        <Flex>
          <Input
            m={{ base: 2, md: 8 }}
            variant="filled"
            placeholder="Tìm mã vận đơn"
            w={{ base: "70vw", md: "30vw" }}
            onChange={handleSearchInputChange}
          />
        </Flex>
        <Dialog setCustomers={setCustomers}/>
      </Flex>

      <CustomerList 
        customers={filteredCustomers} 
        setCustomers={setCustomers}
      />
    </TableContainer>
  );
}
