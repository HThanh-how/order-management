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
import StoreList from "./Table";
import { useGetStoresQuery, useGetStoresForEmployeeQuery, useGetEmployeePermissionQuery } from "@/app/_lib/features/api/apiSlice"
import { Store } from "@/app/type";
import { useAppSelector, useAppDispatch } from "@/app/_lib/hooks";

export default function StoreTable() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const role = useAppSelector((state: any) => state.role.value);
  const {
    data: storesU,
    isLoading: isLoadingU,
    isSuccess: isSuccessU,
    isError: isErrorU,
    error: errorU,
  } = useGetStoresQuery(1, {skip: role === "ROLE_EMPLOYEE"});

  const {
    data: storesE,
    isLoading: isLoadingE,
    isSuccess: isSuccessE,
    isError: isErrorE,
    error: errorE,
  } = useGetStoresForEmployeeQuery(1, {skip: role !== "ROLE_EMPLOYEE"});

  const {
    data: permission,
    isLoading,
    isSuccess,
    isError,
  } = useGetEmployeePermissionQuery(1);

  const getStores = useMemo(() => {
    if (isSuccessU) return storesU.data;
    if (isSuccessE) return storesE.data;
  }, [storesU, storesE]);

  const getPermission = useMemo(() => {
    if (isSuccess) return permission.data;
  }, [permission])

  const handleSearchInputChange = (event: { target: { value: any } }) => {

    const inputValue = event.target.value;
    setSearchInput(inputValue);

    if (isSuccessU || isSuccessE) {
      const filteredResults = getStores.filter(
        (store: any) =>
          store.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          store.phoneNumber.includes(inputValue)
      );

      setFilteredStores(filteredResults);
    }
  };

  useEffect(() => {
    handleSearchInputChange({ target: { value: '' } });
  }, [storesU, isSuccessU, storesE, isSuccessE]);
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
            Cửa hàng
          </Text>
          {/* <Text color={"gray"}>Tuần này bạn có thêm 20 khách hàng mới</Text> */}
          
          <Text display={{base: "none", md:"flex"}} color={"gray"}>Vươn tầm đi xa</Text>
          
        </VStack>
        <Flex>
          <Input
            m={{ base: 2, md: 8 }}
            variant="filled"
            placeholder="Tìm cửa hàng"
            w={{ base: "70vw", md: "30vw" }}
            onChange={handleSearchInputChange}
          />
        </Flex>
        {role === "ROLE_USER" || getPermission && getPermission.includes("CREATE_STORE") && (
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
      ) : filteredStores.length === 0 ? (
        <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          my={12}
        >
          <Text color={'gray'} fontSize={20}>Chưa thêm cửa hàng nào</Text>
        </Flex>

      ) : (
        <StoreList stores={filteredStores} permission={getPermission}/>
      )}

    </TableContainer>
  );
}
