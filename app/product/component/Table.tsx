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
  Spinner
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect, useState } from "react";
import Image from 'next/image';
import EditDialog from "./EditDialog";
import { useAppSelector, useAppDispatch } from '../../_lib/hooks'
import { useRemoveProductMutation } from "@/app/_lib/features/api/apiSlice"

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
  const dispatch = useAppDispatch();
  const [removeProduct, {isLoading}] = useRemoveProductMutation();

  

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
    // await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/products/${id}`, 
    //             {
    //               method: 'DELETE',
    //               headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
    //                 //"userId": `${localStorage.getItem("userId")}`,
    //               }
                
    //             })
    // .then(data => data.json())
    // .then(processedData => console.log(processedData.data))
    // .catch(error => console.log(error))

    //getProducts();
    try {
      await removeProduct(id).unwrap();
      handleDeleteClose();
    } catch (err) {
      console.error('Failed to delete product: ', err)
    }
    
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

  const totalPages = Math.ceil(products.length / productsPerPage);

  

  return (
    <Box overflowX="auto" p={8}>
      <Table variant="simple">
        <Thead bgColor={"gray.50"} rounded={"xl"}>
          <Tr>
            <Th width={"1vw"}>
              <Checkbox
                isChecked={checkedAll}
                onChange={handleMasterCheckboxChange}
              />
            </Th>
            <Th>Tên</Th>
            <Th>Giá</Th>
            <Th>Trạng thái</Th>
            <Th>Thông tin</Th>
            
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
                <Image
                  src="data:image/png;base64,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"
                  width={50}
                  height={20}
                  alt="product image"
                />
                <Center>
                  <strong>{product.name}</strong>
                </Center>
                
              </Flex>
              </Td>
              <Td>{product.price} VNĐ</Td>
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

      <Modal onClose={() => handleDeleteClose()} isOpen={deleteOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
              Bạn có chắc chắn xóa sản phẩm này?
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => handleDeleteClose()}>Đóng</Button>
            <Button colorScheme='orange' onClick={() => handleDelete(selectedProduct.id)}>Xác nhận</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
               
      <Flex justify="space-between" mt={4}>
        <ButtonGroup>
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
        </ButtonGroup>

        <Flex align="center">
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
