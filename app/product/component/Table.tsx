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
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  status: string;
  info: string[];
  best_sell: number;
};

// const users: User[] = [
//   {
//     id: 1,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 3,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 4,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 5,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 6,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 7,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 8,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 9,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 10,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 11,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 12,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 13,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 14,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 15,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 16,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   {
//     id: 1,
//     name: "John Doe",
//     status: "active",
//     tags: ["developer", "designer"],
//     phoneNumber: "+1234567890",
//     address: "123 Main St",
//     note: "Lorem ipsum dolor sit amet",
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     status: "inactive",
//     tags: ["designer"],
//     phoneNumber: "+0987654321",
//     address: "456 Elm St",
//     note: "Consectetur adipiscing elit",
//   },
//   // ...
// ];

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [productSelections, setProductSelections] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);

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
            <Th>Trạng thái</Th>
            <Th>Thông tin</Th>
            <Th>Bán chạy</Th>
            <Th w={"1vw"}>
              <Menu>
                <MenuButton>
                  <Icon as={SlOptionsVertical} />
                </MenuButton>
                <MenuList>
                  <MenuItem>Sửa</MenuItem>
                  {/* <MenuItem>Nhân đôi</MenuItem> */}
                  <MenuItem>Xoá</MenuItem>
                </MenuList>
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
              <Td>{product.name}</Td>
              <Td>{product.status}</Td>
              <Td>
                <Flex>
                  {product.info.slice(0, 3).map((tag, index) => (
                    <Badge key={index} mr={2} colorScheme="green">
                      {tag}
                    </Badge>
                  ))}
                  {product.info.length > 3 && (
                    <Badge colorScheme="blue">+{product.info.length - 3}</Badge>
                  )}
                </Flex>
              </Td>
              <Td>{product.best_sell}</Td>
              <Td>
                <Menu>
                  <MenuButton>
                    <Icon as={SlOptionsVertical} color={"gray"} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Sửa</MenuItem>
                    {/* <MenuItem>Nhân đôi</MenuItem> */}
                    <MenuItem>Xoá</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justify="space-between" mt={4}>
        <ButtonGroup>
          <Button
            onClick={() => handleProductsPerPageChange(5)}
            colorScheme={productsPerPage === 5 ? "teal" : "gray"}
          >
            5
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(10)}
            colorScheme={productsPerPage === 10 ? "teal" : "gray"}
          >
            10
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(15)}
            colorScheme={productsPerPage === 15 ? "teal" : "gray"}
          >
            15
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(20)}
            colorScheme={productsPerPage === 20 ? "teal" : "gray"}
          >
            20
          </Button>
          <Button
            onClick={() => handleProductsPerPageChange(25)}
            colorScheme={productsPerPage === 25 ? "teal" : "gray"}
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
