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
import ProductTable from "./Table";
import { env } from "process";
import { randomUUID } from "crypto";

type Product = {
  id: number;
  name: string;
  photo: string;
  status: string;
  price: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  description: string;
};

// const products: Product[] = [
//   {
//     id: 1,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 1123923,
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 89942,
//   },
//   {
//     id: 3,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 42042,
//   },
//   {
//     id: 4,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 489024,
//   },
//   {
//     id: 5,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 93948,
//   },
//   {
//     id: 6,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 7,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 8,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 9,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 10,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 11,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 12,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 13,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell:9348023,
//   },
//   {
//     id: 14,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 15,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 16,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 1,
//     name: "John Doe",
//     status: "active",
//     info: ["developer", "designer"],
//     best_sell: 9348023,
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     status: "inactive",
//     info: ["designer"],
//     best_sell: 9348023,
//   },
//   // ...
// ];


export default function Product() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const firstUpdate = useRef(true);
  

  useEffect(() => {
    const getProducts = async () => {
      await fetch("http://localhost:8082/api/v1/products", 
                  {
                    method: 'GET',
                    headers: {
                      "Content-Type": "application/json",
                      "userId": '9a74d120-bd12-4e1b-b6da-80f74d70e178',
                    }
                  
                  })
      .then(data => data.json())
      .then(processedData => setProducts(processedData.data))
      .catch(error => console.log(error))

    }

    if (firstUpdate.current) {
      firstUpdate.current = false;
      getProducts();
      return;
    }
    
    console.log(products);
    handleSearchInputChange({ target: { value: '' } });
  }, [products]);

  const handleSearchInputChange = (event: { target: { value: any } }) => {

    const inputValue = event.target.value;
    setSearchInput(inputValue);

    // console.log(inputValue)
    const filteredResults = products.filter(
      (product) =>
        product.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredProducts(filteredResults);
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
            Sản phẩm
          </Text>
          <Text color={"gray"}>Bạn bán hơn 60 sản phẩm mỗi ngày</Text>
        </VStack>
        <Flex>
          <Input
            m={{ base: 2, md: 8 }}
            variant="filled"
            placeholder="Tìm tên sản phẩm"
            w={{ base: "70vw", md: "30vw" }}
            onChange={handleSearchInputChange}
          />
        </Flex>
        <Dialog setProducts={setProducts}/>
      </Flex>

      <ProductTable products={filteredProducts} setProducts={setProducts} />
    </TableContainer>
  );
}
