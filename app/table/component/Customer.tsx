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
import { ChangeEvent, useState } from "react";
import Dialog from "./Dialog";
import CustomerList from "./Table";

type User = {
  id: number;
  name: string;
  status: string;
  tags: string[];
  phoneNumber: string;
  address: string;
  note: string;
};

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 3,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 4,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 5,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 6,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 7,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 8,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 9,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 10,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 11,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 12,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 13,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 14,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 15,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 16,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  {
    id: 1,
    name: "John Doe",
    status: "active",
    tags: ["developer", "designer"],
    phoneNumber: "+1234567890",
    address: "123 Main St",
    note: "Lorem ipsum dolor sit amet",
  },
  {
    id: 2,
    name: "Jane Smith",
    status: "inactive",
    tags: ["designer"],
    phoneNumber: "+0987654321",
    address: "456 Elm St",
    note: "Consectetur adipiscing elit",
  },
  // ...
];

export default function CustomerTable() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleSearchInputChange = (event: { target: { value: any } }) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    // console.log(inputValue)
    const filteredResults = users.filter(
      (user) =>
        user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        user.phoneNumber.includes(inputValue)
    );
    setFilteredUsers(filteredResults);
  };
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

      <CustomerList users={filteredUsers} />
    </TableContainer>
  );
}
