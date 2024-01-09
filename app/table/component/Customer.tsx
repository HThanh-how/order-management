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

export default function CustomerTable() {
  return (
    <TableContainer bgColor={"white"} rounded={"2xl"}>
      <Flex
        alignItems="center"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <VStack      m={{base:2, md:8}} alignItems={"flex-start"} maxW={{base:"80vw", md:"full"}}>
          <Text fontSize={{ base: "xl", md: "3xl" }} fontWeight={700}>
            Khách hàng
          </Text>
          <Text color={"gray"}>Tuần này bạn có thêm 20 khách hàng mới</Text>
        </VStack>
        <Flex>
          <Input
            m={{base:2, md:8}}
            variant="filled"
            placeholder="Tìm mã vận đơn"
            w={{ base: "70vw", md: "30vw" }}
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

      <CustomerList/>
    </TableContainer>
  );
}
