import {
  Box,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Tooltip,
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
import { useRemoveStoreMutation } from "@/app/_lib/features/api/apiSlice";
import { Store } from "@/app/type";
import { useAppSelector } from "@/app/_lib/hooks";
import EditDialog from "./EditDialog";

interface StoreTableProps {
  stores: Store[];
  permission: any;
}

import { chakra } from "@chakra-ui/react";

const GradientText = chakra("span", {
  baseStyle: {
    fontWeight: "bold",
    background: "linear-gradient(90deg, #ff5e09, #ff0348)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
});

const StoreTable: React.FC<StoreTableProps> = ({ stores, permission }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [storeSelections, setStoreSelections] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage, setStoresPerPage] = useState(5);
  const [selectedStore, setSelectedStore] = useState<any>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const role = useAppSelector((state: any) => state.role.value);
  const [removeStore, { isLoading }] = useRemoveStoreMutation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClose = async () => {
    setDeleteOpen(false);
    setSelectedStore({});
  };
  const handleDeleteOpen = async (id: any) => {
    const p = stores.find((tmp) => tmp.storeId === id);
    setSelectedStore({ ...p });
    setDeleteOpen(true);
  };

  const handleDelete = async (id: any) => {
    try {
      await removeStore(id).unwrap();
      handleDeleteClose();
    } catch (err) {
      handleDeleteClose();
      console.error("Failed to delete store: ", err);
      toast({
        title: "Có lỗi khi xóa cửa hàng này",
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Xoá cửa hàng thành công",
      position: "top",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    console.log(removeStore(id).unwrap());
  };

  const handleMasterCheckboxChange = () => {
    setCheckedAll(!checkedAll);

    if (!checkedAll) {
      const allStoreIds = stores.map((store) => store.storeId);
      setStoreSelections(allStoreIds);
    } else {
      setStoreSelections([]);
    }
  };

  const handleCheckboxChange = (storeId: number) => {
    if (storeSelections.includes(storeId)) {
      const updatedSelections = storeSelections.filter(
        (selection) => selection !== storeId
      );
      setStoreSelections(updatedSelections);
    } else {
      setStoreSelections([...storeSelections, storeId]);
    }
  };

  const paginateStores = () => {
    const startingIndex = (currentPage - 1) * storesPerPage;
    const endingIndex = Math.min(startingIndex + storesPerPage, stores.length);
    return stores.slice(startingIndex, endingIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCheckedAll(false);
      setStoreSelections([]);
    } else {
      console.error("Invalid page number");
    }
  };

  const handleStoresPerPageChange = (perPage: number) => {
    setCurrentPage(1);
    setStoresPerPage(perPage);
    setCheckedAll(false);
    setStoreSelections([]);
  };

  const totalPages = Math.ceil(stores.length / storesPerPage);

  const handleUpdate = async (id: any) => {
    const p = stores.find((tmp) => tmp.storeId === id);
    setSelectedStore({ ...p });
    onOpen();
  };

  return (
    <Box overflowX={"auto"} p={8} m={2}>
      <Table variant="simple" size={{ base: "sm", md: "md" }}>
        <Thead bgColor={"gray.50"} rounded={"xl"}>
          <Tr>
            <Th width={"1vw"}>
              <Checkbox
                isChecked={checkedAll}
                onChange={handleMasterCheckboxChange}
              />
            </Th>
            <Th>Name</Th>
            <Th>Số điện thoại</Th>
            <Th>Địa chỉ</Th>
            <Th>Ghi chú</Th>
            {role === "ROLE_USER" && (
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
          
          {paginateStores().map((store) => (
            <Tr key={store.storeId}>
              <Td>
                <Checkbox
                  isChecked={storeSelections.includes(store.storeId)}
                  onChange={() => handleCheckboxChange(store.storeId)}
                />
              </Td>
              <Td>
                <Text maxW={"200px"} minW={"100px"} whiteSpace="normal">
                  {store.name}
                </Text>
              </Td>
              <Td>
                <Text maxW={"120px"} minW={"100px"} whiteSpace="normal">
                  {store.phoneNumber}
                </Text>
              </Td>
              <Td>
                <Tooltip
                  label={`${store.detailedAddress}, ${store.address}`}
                  placement="bottom"
                >
                  <Text whiteSpace="normal" maxW={"400px"} isTruncated>
                    {store.detailedAddress}, {store.address}
                  </Text>
                </Tooltip>
              </Td>

              <Td>
                <Tooltip label={store.description} placement="bottom">
                  <Text maxW={"100px"} whiteSpace="normal" isTruncated>
                    {store.description}
                  </Text>
                </Tooltip>
              </Td>
              {role === "ROLE_USER" && (
                <Td>
                  <Menu>
                    <MenuButton>
                      <Icon as={SlOptionsVertical} color={"gray"} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleUpdate(store.storeId)}>
                        Sửa
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteOpen(store.storeId)}>
                        Xoá
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              )}
              {role === "ROLE_EMPLOYEE" && permission.includes("UPDATE_STORE") && (
                <Td>
                  <Menu>
                    <MenuButton>
                      <Icon as={SlOptionsVertical} color={"gray"} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleUpdate(store.storeId)}>Sửa</MenuItem>
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
        selectedStore={selectedStore}
      />

      <Modal
        onClose={() => handleDeleteClose()}
        isOpen={deleteOpen}
        isCentered
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Xác nhận xoá cửa hàng</ModalHeader>
          <ModalBody>
            <Flex alignItems="center">
              <Text>Bạn có chắc chắn muốn xoá cửa hàng này không?</Text>
            </Flex>
            Đây là yêu cầu không thể hoàn tác.
          </ModalBody>
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
              isLoading={isLoading}
              onClick={() => {
                // setIsLoading(true)
                handleDelete(selectedStore.storeId)
              }}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex justify="space-between" mt={4}>
        {/* <ButtonGroup>
          <Button
            onClick={() => handleStoresPerPageChange(5)}
            colorScheme={storesPerPage === 5 ? "orange" : "gray"}
          >
            5
          </Button>
          <Button
            onClick={() => handleStoresPerPageChange(10)}
            colorScheme={storesPerPage === 10 ? "orange" : "gray"}
          >
            10
          </Button>
          <Button
            onClick={() => handleStoresPerPageChange(15)}
            colorScheme={storesPerPage === 15 ? "orange" : "gray"}
          >
            15
          </Button>
          <Button
            onClick={() => handleStoresPerPageChange(20)}
            colorScheme={storesPerPage === 20 ? "orange" : "gray"}
          >
            20
          </Button>
          <Button
            onClick={() => handleStoresPerPageChange(25)}
            colorScheme={storesPerPage === 25 ? "orange" : "gray"}
          >
            25
          </Button>
        </ButtonGroup> */}
        <Select
          ml={2}
          fontSize={{ base: 10, md: 16 }}
          w={{ base: "15%", md: "20%" }}
          onChange={(e) => handleStoresPerPageChange(Number(e.target.value))}
        >
          <option defaultChecked value="5">
            5 cửa hàng
          </option>
          <option value="10">10 cửa hàng</option>
          <option value="15">15 cửa hàng</option>
          <option value="20">20 cửa hàng</option>
        </Select>

        <Flex ml={{ base: 6 }} align="center">
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

export default StoreTable;
