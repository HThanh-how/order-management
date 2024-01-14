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
import { ChangeEvent, useEffect, useState } from "react";
import Dialog from "./Dialog";
import CustomerList from "./Table";

type Staff = {
  id: number;
  name: string;
  status: string;
  permission: string[];
  phoneNumber: string;
};

const staffs: Staff[] = [
  {
    id: 1,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 2,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 3,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 4,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 5,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 6,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 7,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 8,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 9,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 10,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 11,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 12,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 13,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 14,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 15,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 16,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  {
    id: 1,
    name: "John Doe",
    status: "Trực tuyến",
    permission: ["Xóa đơn", "Tạo đơn"],
    phoneNumber: "+1234567890",
  },
  {
    id: 2,
    name: "Jane Smith",
    status: "Ngoại tuyến",
    permission: ["Tạo đơn"],
    phoneNumber: "+0987654321",
  },
  // ...
];

export default function CustomerTable() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);

  useEffect(() => {
    handleSearchInputChange({ target: { value: '' } });
  }, []);

  const handleSearchInputChange = (event: { target: { value: any } }) => {

    const inputValue = event.target.value;
    setSearchInput(inputValue);

    // console.log(inputValue)
    const filteredResults = staffs.filter(
      (staff) =>
        staff.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredStaffs(filteredResults);
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
            Nhân viên
          </Text>
          <Text color={"gray"}>Tuần này bạn có thêm 20 nhân viên mới</Text>
        </VStack>
        <Flex>
          <Input
            m={{ base: 2, md: 8 }}
            variant="filled"
            placeholder="Tìm nhân viên"
            w={{ base: "70vw", md: "30vw" }}
            onChange={handleSearchInputChange}
          />
        </Flex>
        <Dialog />
      </Flex>
      {/* <Table variant="simple">

        <Thead>
          <Tr>
            <Th>Khách hàng</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td isNumeric>30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td>metres (m)</Td>
            <Td isNumeric>0.91444</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot>
      </Table> */}

      <CustomerList staffs={filteredStaffs} />
    </TableContainer>
  );
}
