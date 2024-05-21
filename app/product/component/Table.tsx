import {
  Box,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Badge,
  Tr,
  ButtonGroup,
  Button,
  Input,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  useToast,
  Select, 
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect, useState } from "react";
import Image from 'next/image';
import EditDialog from "./EditDialog";
import { useAppSelector, useAppDispatch } from '../../_lib/hooks'
import { useRemoveProductMutation } from "@/app/_lib/features/api/apiSlice"
import { Product } from "@/app/type";

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [productSelections, setProductSelections] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [removeProduct, {isLoading}] = useRemoveProductMutation();
  const toast = useToast();
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const role = useAppSelector((state: any) => state.role.value)

  

  const handleDeleteClose = async () => {
    setDeleteOpen(false);
    setSelectedProduct({});
  }
  const handleDeleteOpen = async (id: any) => {
    const p = products.find((tmp) => tmp.id === id);
    setSelectedProduct({...p});
    setDeleteOpen(true);
  }

  const handleUpdate = async (id: any) => {
    const p = products.find((tmp) => tmp.id === id);
    setSelectedProduct({...p});
    onOpen();
  }

const handleDelete = async (id: any) => {
    let response;
    try {
      response = await removeProduct(id).unwrap();     
      // console.log(response.message);
      handleDeleteClose();
    } catch (err) {
      handleDeleteClose();
      console.error('Failed to delete product: ', err)
      toast({
        title: response?.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }
    toast({
      title: response?.message,
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleMasterCheckboxChange = () => {
    setCheckedAll(!checkedAll);

    if (!checkedAll) {
      const allProductIds = products.map((product) => product.id);
      setProductSelections(allProductIds);
    } else {
      setProductSelections([]);
    }
  };

  const handleCheckboxChange = (productId: number) => {
    if (productSelections.includes(productId)) {
      const updatedSelections = productSelections.filter(
        (selection) => selection !== productId
      );
      setProductSelections(updatedSelections);
    } else {
      setProductSelections([...productSelections, productId]);
    }
  };

  const paginateProducts = () => {
    const startingIndex = (currentPage - 1) * productsPerPage;
    const endingIndex = Math.min(startingIndex + productsPerPage, products.length);
    return products.slice(startingIndex, endingIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCheckedAll(false);
      setProductSelections([]);
    } else {
      console.error("Invalid page number");
    }
  };

  const handleProductsPerPageChange = (perPage: number) => {
    setCurrentPage(1);
    setProductsPerPage(perPage);
    setCheckedAll(false);
    setProductSelections([]);
  };

  const formatMoney = (number: number) => {
    const tmp = number.toString();
    const formattedInteger = tmp.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const formattedMoney = `${formattedInteger}`;
    return formattedMoney;
  };

  const totalPages = Math.ceil(products.length / productsPerPage);

  

  return (
    <Box overflowX={{base: 'scroll', md: "hidden"}} p={8}>
      <Table variant="simple" size={{base: 'sm', md: 'md'}}>
        <Thead bgColor={"gray.50"} rounded={"xl"}>
          <Tr>
            <Th w={"1vw"}>
              <Checkbox
                isChecked={checkedAll}
                onChange={handleMasterCheckboxChange}
              />
            </Th>
            {isMobile ?
              <Th textAlign='center'>Tên</Th>
            :
              <Th>Tên</Th>
            }
            {/* <Th>Giá</Th> */}
            <Th>Trạng thái</Th>
            <Th>Thông tin</Th>
            
            { role === "ROLE_USER" && (
              <Th w={"1vw"}>
                <Menu>
                  <MenuButton>
                    <Icon as={SlOptionsVertical} />
                  </MenuButton>
                  {/* <MenuList>
                    <MenuItem>Sửa</MenuItem>
                    <MenuItem>Xoá</MenuItem>
                  </MenuList> */}
                </Menu>
              </Th>
            )}
            
          </Tr>
        </Thead>
        <Tbody>
          {paginateProducts().map((product) => (
            <Tr key={product.id}>
              <Td>
                <Checkbox
                  isChecked={productSelections.includes(product.id)}
                  onChange={() => handleCheckboxChange(product.id)}
                />
              </Td>
              <Td>
              <Flex>
                {!isMobile ?
                <>
                  <Image
                    src={product.photoUrl? product.photoUrl : "/productImageDefault.webp"}
                    width={50}
                    height={20}
                    alt="product image"
                  />
                  
                  <VStack ml={4}>
                    <Center>
                      <strong>{product.name}</strong> 
                    </Center>
                    <Center>
                      {formatMoney(product.price)} VNĐ
                    </Center>
                  </VStack>
                </>
                :
                <VStack>
                  <Center>
                    <strong>{product.name}</strong> 
                  </Center>
                  <Center>
                    {formatMoney(product.price)} VNĐ
                  </Center>
                </VStack>
                }
              </Flex>
              </Td>
              {/* <Td>{product.price} VNĐ</Td> */}
              <Td> 
                {product.status === "AVAILABLE" && (
                  <Badge mr={2} colorScheme="green">
                    CÒN HÀNG
                  </Badge>
                )}

                {product.status === "OUT_OF_STOCK" && (
                  <Badge mr={2} colorScheme="red">
                    HẾT HÀNG
                  </Badge>
                )}

                {product.status === "BACK_ORDER" && (
                  <Badge mr={2} colorScheme="blue">
                    DỰ TRỮ
                  </Badge>
                )}
              </Td>
              <Td>
                <Flex>
                   D: {product.length}cm   R: {product.width}cm  C: {product.height}cm <br />
                   Khối lượng: {product.weight}g 
                </Flex>
              </Td>
              
              { role === "ROLE_USER" && (
                <Td>
                  <Menu>
                    <MenuButton>
                      <Icon as={SlOptionsVertical} color={"gray"} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleUpdate(product.id)}>Sửa</MenuItem>
                      <MenuItem onClick={() => handleDeleteOpen(product.id)}>Xoá</MenuItem>
                    </MenuList>
                  </Menu>  
                </Td>
              )}
              
            </Tr>
          ))}
        </Tbody>
      </Table>

      <EditDialog 
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        //setProducts={setProducts}
        selectedProduct={selectedProduct}
      />

      <Modal onClose={() => handleDeleteClose()} isOpen={deleteOpen} isCentered size={{base: 'sm', md: 'md'}}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Xác nhận xóa sản phẩm</ModalHeader>
          <ModalBody>
              Bạn có chắc chắn xóa sản phẩm này?
              <Text>Đây là yêu cầu không thể hoàn tác.</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => handleDeleteClose()}>Đóng</Button>
            <Button color="white"
              backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
              sx={{
                '@media (hover: hover)': {
                  _hover: {
                    backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                  }
                }
              }} onClick={() => handleDelete(selectedProduct.id)}>Xác nhận</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
               
      <Flex justify="space-between" mt={4}>
        {/* <ButtonGroup>
          <Button
            onClick={() => handleProductsPerPageChange(5)}
            colorScheme={productsPerPage === 5 ? "orange" : "gray"}
          >
            5
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(10)}
            colorScheme={productsPerPage === 10 ? "orange" : "gray"}
          >
            10
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(15)}
            colorScheme={productsPerPage === 15 ? "orange" : "gray"}
          >
            15
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(20)}
            colorScheme={productsPerPage === 20 ? "orange" : "gray"}
          >
            20
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(25)}
            colorScheme={productsPerPage === 25 ? "orange" : "gray"}
          >
            25
          </Button>
        </ButtonGroup> */}
        <Select ml={2} fontSize={{base: 10, md: 16}} w={{base: '15%', md:'20%'}} onChange={(e) => handleProductsPerPageChange(Number(e.target.value))}>
          <option defaultChecked value='5' >5 sản phẩm</option>
          <option value='10' >10 sản phẩm</option>
          <option value='15' >15 sản phẩm</option>
          <option value='20' >20 sản phẩm</option>
        </Select>

        <Flex ml={{base: 6}} align="center">
          <Text>{`Page `}</Text>
          <Input
            mx={2}
            type="number"
            min={1}
            max={totalPages}
            placeholder={currentPage.toString()}
            onChange={(e) => handlePageChange(Number(e.target.value))}
          />
          <Text>{` of ${totalPages}`}</Text>
        </Flex>

        <ButtonGroup>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default ProductTable;
