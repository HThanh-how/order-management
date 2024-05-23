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
  Tooltip,
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
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../_lib/hooks";
import { useRemoveOrderMutation } from "@/app/_lib/features/api/apiSlice";
import { Order } from "@/app/type";
import { useRouter } from "next/navigation";

interface OrderTableProps {
  orders: any[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [orderSelections, setOrderSelections] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<any>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const toast = useToast();
  const [removeOrder, { isLoading }] = useRemoveOrderMutation();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);
  const handleDeleteClose = async () => {
    setDeleteOpen(false);
    setSelectedOrder({});
  };
  const handleDeleteOpen = async (id: any) => {
    const p = orders.find((tmp) => tmp.id === id);
    setSelectedOrder({ ...p });
    setDeleteOpen(true);
  };

  const handleDelete = async (id: any) => {
    try {
      await removeOrder(id).unwrap();
      handleTabChange(0);
      handleDeleteClose();
    } catch (err) {
      console.error("Failed to delete order: ", err);
      toast({
        title: "Có lỗi khi xóa đơn hàng này",
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Xoá đơn hàng thành công",
      position: "top",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleMasterCheckboxChange = () => {
    setCheckedAll(!checkedAll);

    if (!checkedAll) {
      const allOrderIds = orders.map((order) => order.id);
      setOrderSelections(allOrderIds);
    } else {
      setOrderSelections([]);
    }
  };

  const handleCheckboxChange = (orderId: number) => {
    if (orderSelections.includes(orderId)) {
      const updatedSelections = orderSelections.filter(
        (selection) => selection !== orderId
      );
      setOrderSelections(updatedSelections);
    } else {
      setOrderSelections([...orderSelections, orderId]);
    }
  };

  const paginateOrders = () => {
    const startingIndex = (currentPage - 1) * ordersPerPage;
    const endingIndex = Math.min(
      startingIndex + ordersPerPage,
      filteredOrders.length
    );
    return filteredOrders.slice(startingIndex, endingIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCheckedAll(false);
      setOrderSelections([]);
    } else {
      console.error("Invalid page number");
    }
  };

  const handleOrdersPerPageChange = (perPage: number) => {
    setCurrentPage(1);
    setOrdersPerPage(perPage);
    setCheckedAll(false);
    setOrderSelections([]);
  };

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    if (index === 0) setFilteredOrders(orders);
    if (index === 1)
      setFilteredOrders(
        orders.filter((order) => order.orderStatus === "DELIVERED")
      );
    if (index === 2)
      setFilteredOrders(
        orders.filter((order) => order.orderStatus === "PROCESSING")
      );
    if (index === 3)
      setFilteredOrders(
        orders.filter((order) => order.orderStatus === "CREATED")
      );
    if (index === 4)
      setFilteredOrders(
        orders.filter((order) => order.orderStatus === "CANCELLED")
      );
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <Box overflowX={{ base: "scroll" }} p={8} pt={0}>
      <Tabs
        index={tabIndex}
        isFitted
        variant="enclosed"
        colorScheme="red"
        mb={2}
        onChange={(index) => handleTabChange(index)}
      >
        <TabList>
          <Tab
            _selected={{
              color: "white",
              bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
            }}
          >
            Tất cả
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
            }}
          >
            Thành công
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
            }}
          >
            Đang giao
          </Tab>
          {/* <Tab>Đang vận chuyển</Tab> */}
          <Tab
            _selected={{
              color: "white",
              bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
            }}
          >
            Chờ lấy hàng
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
            }}
          >
            Bị hủy
          </Tab>
        </TabList>
      </Tabs>
      <Table variant="simple" size={{ base: "sm", md: "md" }}>
        <Thead bgColor={"gray.50"} rounded={"xl"}>
          <Tr>
            <Th width={"1vw"}>
              <Checkbox
                isChecked={checkedAll}
                onChange={handleMasterCheckboxChange}
              />
            </Th>
            <Th>Mã đơn</Th>
            <Th>Thành tiền</Th>
            <Th>Địa chỉ</Th>
            <Th>Cập nhật lần cuối</Th>
            <Th>Trạng thái</Th>

            <Th w={"1vw"}>
              <Menu>
                <MenuButton>
                  <Icon as={SlOptionsVertical} />
                </MenuButton>
              </Menu>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginateOrders().map((order) => (
            <Tr key={order.id} style={{ cursor: "pointer" }}>
              <Td>
                <Checkbox
                  isChecked={orderSelections.includes(order.id)}
                  onChange={() => handleCheckboxChange(order.id)}
                />
              </Td>
              <Td onClick={() => router.push(`/order-details?id=${order.id}`)}>
                <Text maxW={"100px"}>
                  <strong>{order.code}</strong>
                </Text>
              </Td>
              <Td onClick={() => router.push(`/order-details?id=${order.id}`)}>
                <Text maxW={"100px"}>{order.price?.collectionCharge} VNĐ</Text>
              </Td>

              <Td
                onClick={() => router.push(`/order-details?id=${order.id}`)}
                maxW={"300px"}
              >
                <Tooltip
                  label={order.receiverDto.detailedAddress}
                  placement="bottom"
                >
                  <Text whiteSpace={"normal"} isTruncated>
                    {order.receiverDto.detailedAddress}
                  </Text>
                </Tooltip>
              </Td>
              <Td onClick={() => router.push(`/order-details?id=${order.id}`)}>
                {order.lastUpdatedBy}
              </Td>
              <Td onClick={() => router.push(`/order-details?id=${order.id}`)}>
                {order.orderStatus === "DELIVERED" && (
                  <Badge mr={2} colorScheme="green">
                    ĐÃ GIAO
                  </Badge>
                )}

                {order.orderStatus === "CANCELLED" && (
                  <Badge mr={2} colorScheme="red">
                    BỊ HỦY
                  </Badge>
                )}

                {order.orderStatus === "PROCESSING" && (
                  <Badge mr={2} colorScheme="blue">
                    ĐANG XỬ LÝ
                  </Badge>
                )}
                {order.orderStatus === "CREATED" && (
                  <Badge mr={2} colorScheme="gray">
                    ĐÃ TẠO
                  </Badge>
                )}
              </Td>

              <Td>
                <Menu>
                  <MenuButton>
                    <Icon as={SlOptionsVertical} color={"gray"} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() =>
                        router.push(`/order-details?id=${order.id}`)
                      }
                    >
                      Sửa
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteOpen(order.id)}>
                      Xoá
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal onClose={() => handleDeleteClose()} isOpen={deleteOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>Bạn có chắc chắn xóa đơn hàng này?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => handleDeleteClose()}>
              Đóng
            </Button>
            <Button
              color="white"
              backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
              sx={{
                "@media (hover: hover)": {
                  _hover: {
                    backgroundImage:
                      "linear-gradient(to right, #df5207, #d80740)",
                  },
                },
              }}
              onClick={() => handleDelete(selectedOrder.id)}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex justify="space-between" mt={4}>
        <Select
          ml={2}
          fontSize={{ base: 10, md: 16 }}
          w={{ base: "15%", md: "20%" }}
          onChange={(e) => handleOrdersPerPageChange(Number(e.target.value))}
        >
          <option defaultChecked value="5">
            5 đơn hàng
          </option>
          <option value="10">10 đơn hàng</option>
          <option value="15">15 đơn hàng</option>
          <option value="20">20 đơn hàng</option>
        </Select>

        <Flex ml={{ base: 6 }} align="center">
          <Text>{`Page `}</Text>
          <Input
            mx={2}
            type="number"
            min={1}
            max={totalPages}
            maxLength={255}
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

export default OrderTable;
