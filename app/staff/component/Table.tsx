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
  Select,
  AspectRatio,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { Staff } from "@/app/type";
import { useRemoveEmployeeMutation } from "@/app/_lib/features/api/apiSlice";
import EditDialog from "./EditDialog";

interface StaffTableProps {
  staffs: Staff[];
}

const StaffTable: React.FC<StaffTableProps> = ({ staffs }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [staffSelections, setStaffSelections] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffsPerPage, setStaffsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState<any>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [staffId, setStaffId] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const toast = useToast();

  const [removeEmployee, { isLoading }] = useRemoveEmployeeMutation();

  const handleDeleteClose = async () => {
    setDeleteOpen(false);
    setSelectedEmployee({});
  }
  const handleDeleteOpen = async (id: any) => {
    const p = staffs.find((tmp) => tmp.employeeId === id);
    setSelectedEmployee({ ...p });
    setDeleteOpen(true);
  }

  const handleDelete = async (id: any) => {
    try {
      await removeEmployee(id).unwrap();
      handleDeleteClose();
    } catch (err) {
      handleDeleteClose();
      console.error('Failed to delete customer: ', err)
      toast({
        title: 'Có lỗi khi xóa nhân viên này',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }
    toast({
      title: "Xoá nhân viên thành công",
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleUpdate = async (staff: any) => {
    setSelectedStaff(staff);
    onOpen();
  }

  const handleMasterCheckboxChange = () => {
    setCheckedAll(!checkedAll);

    if (!checkedAll) {
      const allStaffIds = staffs.map((staff) => staff.employeeId);
      setStaffSelections(allStaffIds);
    } else {
      setStaffSelections([]);
    }
  };

  const handleCheckboxChange = (staffId: string) => {
    if (staffSelections.includes(staffId)) {
      const updatedSelections = staffSelections.filter(
        (selection) => selection !== staffId
      );
      setStaffSelections(updatedSelections);
    } else {
      setStaffSelections([...staffSelections, staffId]);
    }
  };

  const paginateStaffs = () => {
    const startingIndex = (currentPage - 1) * staffsPerPage;
    const endingIndex = Math.min(startingIndex + staffsPerPage, staffs.length);
    return staffs.slice(startingIndex, endingIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCheckedAll(false);
      setStaffSelections([]);
    } else {
      console.error("Invalid page number");
    }
  };

  const handleStaffsPerPageChange = (perPage: number) => {
    setCurrentPage(1);
    setStaffsPerPage(perPage);
    setCheckedAll(false);
    setStaffSelections([]);
  };

  const totalPages = Math.ceil(staffs.length / staffsPerPage);

  return (
    
    <Box overflowX={{base: 'scroll', md: "scroll"}} p={8}>
      <Table variant="simple" size={{base: 'sm', md: 'md'}}>
        <Thead bgColor={"gray.50"} rounded={"xl"}>
          <Tr>
            <Th width={"1vw"}>
              <Checkbox
                isChecked={checkedAll}
                onChange={handleMasterCheckboxChange}
              />
            </Th>
            <Th>Email</Th>
            {/* <Th>Trạng thái</Th> */}
            <Th>Số điện thoại</Th>
            <Th>Quyền</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginateStaffs().map((staff) => (
            <Tr key={staff.employeeId}>
              <Td>
                <Checkbox
                  isChecked={staffSelections.includes(staff.employeeId)}
                  onChange={() => handleCheckboxChange(staff.employeeId)}
                />
              </Td>
              <Td>{staff.email}</Td>
              {/* <Td>{staff.status}</Td> */}
              <Td>{staff.phone}</Td>
              <Td>
                <Flex>
                  {staff.permissions.map((tag, index) => (
                  <div key={index}>
                    {tag === "VIEW_ONLY" && (
                      <Badge mr={2} colorScheme="gray">
                        XEM ĐƠN
                      </Badge>
                    )}
    
                    {tag === "MANAGE_ORDER" && (
                      <Badge mr={2} colorScheme="red">
                        QUẢN LÝ
                      </Badge>
                    )}
    
                    {tag === "UPDATE_ORDER" && (
                      <Badge mr={2} colorScheme="blue">
                        CẬP NHẬT
                      </Badge>
                    )}

                    {tag === "CREATE_ORDER" && (
                      <Badge mr={2} colorScheme="green">
                        TẠO ĐƠN
                      </Badge>
                    )}
                  </div>
                  ))}
                  
                </Flex>
              </Td>
              <Td>
                <Menu>
                  <MenuButton>
                    <Icon as={SlOptionsVertical} color={"gray"} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleUpdate(staff)}>Sửa</MenuItem>
                    <MenuItem onClick={() => handleDeleteOpen(staff.employeeId)}>Xoá</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <EditDialog
        isOpen={isOpen}
        onClose={onClose}
  staff={selectedStaff || undefined}
      />

      <Modal onClose={() => handleDeleteClose()} isOpen={deleteOpen} isCentered size={{ base: 'sm', md: 'md' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Xác nhận Xóa nhân viên</ModalHeader>
          <ModalBody>
            Bạn có chắc chắn xóa nhân viên này?
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
              }} 
              isLoading={isLoading}
              onClick={() => handleDelete(selectedEmployee.employeeId)}>Xác nhận</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex justify="space-between" mt={4}>
        <Select ml={2} fontSize={{base: 10, md: 16}} w={{base: '15%', md:'20%'}} onChange={(e) => handleStaffsPerPageChange(Number(e.target.value))}>
          <option defaultChecked value='5' >5 nhân viên</option>
          <option value='10' >10 nhân viên</option>
          <option value='15' >15 nhân viên</option>
          <option value='20' >20 nhân viên</option>
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

export default StaffTable;
