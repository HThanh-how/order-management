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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { useRemoveCustomerMutation } from "@/app/_lib/features/api/apiSlice"
import { Customer } from "@/app/type";
import { useAppSelector } from "@/app/_lib/hooks";
import EditDialog from "./EditDialog";

interface CustomerTableProps {
  customers: Customer[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [customerSelections, setCustomerSelections] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage, setCustomersPerPage] = useState(5);
  const [selectedCustomer, setSelectedCustomer] = useState<any>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [removeCustomer, {isLoading}] = useRemoveCustomerMutation();
  const toast = useToast();
  const role = useAppSelector((state) => state.role.value);
  const isEmployee: boolean = role === 'ROLE_EMPLOYEE' ? true : false;


  const handleDeleteClose = async () => {
    setDeleteOpen(false);
    setSelectedCustomer({});
  }
  const handleDeleteOpen = async (id: any) => {
    const p = customers.find((tmp) => tmp.id === id);
    setSelectedCustomer({...p});
    setDeleteOpen(true);
  }

  const handleDelete = async (id: any) => {
    try {
      await removeCustomer(id).unwrap();
      handleDeleteClose();
    } catch (err) {
      handleDeleteClose();
      console.error('Failed to delete customer: ', err)
      toast({
        title: 'Có lỗi khi xóa khách hàng này',
        
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }
    toast({
      title: "Xoá khách hàng thành công",
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleMasterCheckboxChange = () => {
    setCheckedAll(!checkedAll);

    if (!checkedAll) {
      const allCustomerIds = customers.map((customer) => customer.id);
      setCustomerSelections(allCustomerIds);
    } else {
      setCustomerSelections([]);
    }
  };

  const handleCheckboxChange = (customerId: number) => {
    if (customerSelections.includes(customerId)) {
      const updatedSelections = customerSelections.filter(
        (selection) => selection !== customerId
      );
      setCustomerSelections(updatedSelections);
    } else {
      setCustomerSelections([...customerSelections, customerId]);
    }
  };

  const paginateCustomers = () => {
    const startingIndex = (currentPage - 1) * customersPerPage;
    const endingIndex = Math.min(startingIndex + customersPerPage, customers.length);
    return customers.slice(startingIndex, endingIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCheckedAll(false);
      setCustomerSelections([]);
    } else {
      console.error("Invalid page number");
    }
  };

  const handleCustomersPerPageChange = (perPage: number) => {
    setCurrentPage(1);
    setCustomersPerPage(perPage);
    setCheckedAll(false);
    setCustomerSelections([]);
  };

  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handleUpdate = async (id: any) => {
    const p = customers.find((tmp) => tmp.id === id);
    setSelectedCustomer({...p});
    onOpen();
  }

  return (
    <Box overflowX={{base: 'scroll', md: "hidden"}} p={8}>
      <Table variant="simple" size={{base: 'sm', md: 'md'}}>
        <Thead bgColor={"gray.50"} rounded={"xl"}>
          <Tr>
            <Th width={"1vw"}>
              <Checkbox
                isChecked={checkedAll}
                onChange={handleMasterCheckboxChange}
              />
            </Th>
            <Th>Tên</Th>
            <Th>Số điện thoại</Th>
            <Th>Địa chỉ</Th>
            <Th>Ghi chú</Th>
            { role === 'ROLE_USER' && (
            <Th w={"1vw"}>
              <Menu>
                <MenuButton>
                  <Icon as={SlOptionsVertical} />
                </MenuButton>
              </Menu>
            </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {paginateCustomers().map((customer) => (
            <Tr key={customer.id}>
              <Td>
                <Checkbox
                  isChecked={customerSelections.includes(customer.id)}
                  onChange={() => handleCheckboxChange(customer.id)}
                />
              </Td>
              <Td>{customer.name}</Td>
              {/* <Td> <Badge
                colorScheme={
                  customer.status === "warning"
                    ? "yellow"
                    : customer.status === "report"
                    ? "orange"
                    : customer.status === "blacklist"
                    ? "red"
                    : "green"
                }
                borderRadius={"xl"}
              >
                {customer.status}
              </Badge></Td>
              <Td>
                <Flex>
                  {customer.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} mr={2} colorScheme="blue">
                      {tag}
                    </Badge>
                  ))}
                  {customer.tags.length > 3 && (
                    <Badge colorScheme="purple">+{customer.tags.length - 3}</Badge>
                  )}
                </Flex>
              </Td> */}
              <Td>{customer.phoneNumber}</Td>
              <Td>{customer.detailedAddress}, {customer.address}</Td>
              <Td>{customer.note}</Td>
              { role === 'ROLE_USER' && (
              <Td>
                <Menu>
                  <MenuButton>
                    <Icon as={SlOptionsVertical} color={"gray"} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleUpdate(customer.id)}>Sửa</MenuItem>
                    <MenuItem onClick={() => handleDeleteOpen(customer.id)}>Xoá</MenuItem>
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
        onClose={onClose}
        //setProducts={setProducts}
        selectedCustomer={selectedCustomer}
      />

      <Modal onClose={() => handleDeleteClose()} isOpen={deleteOpen} isCentered size={{base: 'sm', md: 'md'}}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Xác nhận Xóa khách hàng</ModalHeader>
          <ModalBody>
              Bạn có chắc chắn xóa khách hàng này?
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => handleDeleteClose()}>Đóng</Button>
            <Button                   color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  sx={{
                    '@media (hover: hover)': {
                      _hover: {
                        backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                      }
                    }
                  }} onClick={() => handleDelete(selectedCustomer.id)}>Xác nhận</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex justify="space-between" mt={4}>
        {/* <ButtonGroup>
          <Button
            onClick={() => handleCustomersPerPageChange(5)}
            colorScheme={customersPerPage === 5 ? "orange" : "gray"}
          >
            5
          </Button>
          <Button
            onClick={() => handleCustomersPerPageChange(10)}
            colorScheme={customersPerPage === 10 ? "orange" : "gray"}
          >
            10
          </Button>
          <Button
            onClick={() => handleCustomersPerPageChange(15)}
            colorScheme={customersPerPage === 15 ? "orange" : "gray"}
          >
            15
          </Button>
          <Button
            onClick={() => handleCustomersPerPageChange(20)}
            colorScheme={customersPerPage === 20 ? "orange" : "gray"}
          >
            20
          </Button>
          <Button
            onClick={() => handleCustomersPerPageChange(25)}
            colorScheme={customersPerPage === 25 ? "orange" : "gray"}
          >
            25
          </Button>
        </ButtonGroup> */}
        <Select ml={2} fontSize={{base: 10, md: 16}} w={{base: '15%', md:'20%'}} onChange={(e) => handleCustomersPerPageChange(Number(e.target.value))}>
          <option defaultChecked value='5' >5 khách hàng</option>
          <option value='10' >10 khách hàng</option>
          <option value='15' >15 khách hàng</option>
          <option value='20' >20 khách hàng</option>
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

export default CustomerTable;
