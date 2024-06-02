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
import { useGetProductsQuery, useGetProductsForEmployeeQuery, useGetEmployeePermissionQuery } from "@/app/_lib/features/api/apiSlice"
// import { Product } from "@/app/type";

export default function Product() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const role = useAppSelector((state: any) => state.role.value);
  const {
    data: productsU,
    isLoading: isLoadingU,
    isSuccess: isSuccessU,
    isError: isErrorU,
    error: errorU,
  } = useGetProductsQuery(1, {skip: role === "ROLE_EMPLOYEE"})

  const {
    data: productsE,
    isLoading: isLoadingE,
    isSuccess: isSuccessE,
    isError: isErrorE,
    error: errorE,
  } = useGetProductsForEmployeeQuery(1, {skip: role !== "ROLE_EMPLOYEE"});

  const {
    data: permission,
    isLoading,
    isSuccess,
    isError,
  } = useGetEmployeePermissionQuery(1);

  const getProducts = useMemo(() => {
    if (isSuccessU) return productsU.data;
    if (isSuccessE) return productsE.data;
  }, [productsU, productsE]);

  const getPermission = useMemo(() => {
    if (isSuccess) return permission.data;
  }, [permission])

  const handleSearchInputChange = (event: { target: { value: any } }) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    if (isSuccessU || isSuccessE) {
      const filteredResults = getProducts.filter(
        (product: any) =>
          product.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredProducts(filteredResults);
    }
  };

  useEffect(() => {
    handleSearchInputChange({ target: { value: '' } });
  }, [productsU, isSuccessU, productsE, isSuccessE]);

  return (
    <TableContainer bgColor={"white"} rounded={"2xl"}>
      <Flex
        alignItems="center"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <VStack
          m={{ base: 2, lg: 8 }}
          alignItems={"flex-start"}
          maxW={{ base: "80vw", lg: "full" }}
        >
          <Text fontSize={{ base: "2xl", md: "3xl" }} backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
            backgroundClip="text"
            color="transparent" fontWeight={700}>
            Sản phẩm
          </Text>
          
          <Text display={{base: "none", md:"flex"}} color={"gray"}>Hôm nay thật tuyệt</Text>
          
          
        </VStack>
        <Flex>
          <Input
            m={{ base: 2, xl: 8 }}
            variant="filled"
            maxLength={255}
            placeholder="Tìm sản phẩm"
            w={{ base: "70vw", md: "40vw", lg:"25vw", xl: "30vw" }}
            onChange={handleSearchInputChange}
          />
        </Flex>
        {(role === "ROLE_USER" || getPermission && getPermission.includes("CREATE_PRODUCT") )&& (
          <Dialog />
        )}

      </Flex>

      {isLoadingU || isLoadingE ? (
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
      ) : isErrorU || isErrorE ? (
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
          my={12}
        >
          <Text color={'gray'} fontSize={20}>Chưa thêm sản phẩm nào</Text>
        </Flex>

      ) : (
        <ProductTable products={filteredProducts} permission={getPermission}/>
      )}

    </TableContainer>
  );
}
