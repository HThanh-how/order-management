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
  Skeleton,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import Dialog from "./Dialog";
import ProductTable from "./Table";
import { useAppSelector, useAppDispatch } from "@/app/_lib/hooks";
import { useGetProductsQuery } from "@/app/_lib/features/api/apiSlice"
// import { Product } from "@/app/type";

export default function Product() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const role = useAppSelector((state: any) => state.role.value);
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery()

  const getProducts = useMemo(() => {
    if (isSuccess) return products.data
  }, [products])

  const handleSearchInputChange = (event: { target: { value: any } }) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    if (isSuccess) {
      const filteredResults = getProducts.filter(
        (product: any) =>
          product.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredProducts(filteredResults);
    }
  };

  useEffect(() => {
    handleSearchInputChange({ target: { value: '' } });
  }, [products]);

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
        {role === "ROLE_USER" && (
          <Dialog />
        )}

      </Flex>

      {isLoading ? (
         <Box overflowX={{ base: "scroll", md: "hidden" }} p={8} pt={0}>
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
      ) : isError ? (
        <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          m={4}
        >
          <Alert w='25%' status='error'>
            <AlertIcon />
            Can not fetch data from server
          </Alert>
        </Flex>
      ) : filteredProducts.length === 0 ? (
        <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
        >
          <Text color={'gray'} fontSize={20}>Chưa thêm sản phẩm nào</Text>
        </Flex>

      ) : (
        <ProductTable products={filteredProducts} />
      )}

    </TableContainer>
  );
}
