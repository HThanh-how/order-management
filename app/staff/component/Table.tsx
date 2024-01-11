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

type Staff = {
  id: number;
  name: string;
  status: string;
  permission: string[];
  phoneNumber: string;
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

interface StaffTableProps {
  staffs: Staff[];
}

const StaffTable: React.FC<StaffTableProps> = ({ staffs }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [staffSelections, setStaffSelections] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffsPerPage, setStaffsPerPage] = useState(5);

  const handleMasterCheckboxChange = () => {
    setCheckedAll(!checkedAll);

    if (!checkedAll) {
      const allStaffIds = staffs.map((staff) => staff.id);
      setStaffSelections(allStaffIds);
    } else {
      setStaffSelections([]);
    }
  };

  const handleCheckboxChange = (staffId: number) => {
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
            <Th>Name</Th>
            <Th>Trạng thái</Th>
            <Th>Số điện thoại</Th>
            <Th>Quyền</Th>
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
          {paginateStaffs().map((staff) => (
            <Tr key={staff.id}>
              <Td>
                <Checkbox
                  isChecked={staffSelections.includes(staff.id)}
                  onChange={() => handleCheckboxChange(staff.id)}
                />
              </Td>
              <Td>{staff.name}</Td>
              <Td>{staff.status}</Td>
              <Td>{staff.phoneNumber}</Td>
              <Td>
                <Flex>
                  {staff.permission.slice(0, 3).map((tag, index) => (
                    <Badge key={index} mr={2} colorScheme="green">
                      {tag}
                    </Badge>
                  ))}
                  {staff.permission.length > 3 && (
                    <Badge colorScheme="blue">+{staff.permission.length - 3}</Badge>
                  )}
                </Flex>
              </Td>
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
            onClick={() => handleStaffsPerPageChange(5)}
            colorScheme={staffsPerPage === 5 ? "teal" : "gray"}
          >
            5
          </Button>
          <Button
            onClick={() => handleStaffsPerPageChange(10)}
            colorScheme={staffsPerPage === 10 ? "teal" : "gray"}
          >
            10
          </Button>
          <Button
            onClick={() => handleStaffsPerPageChange(15)}
            colorScheme={staffsPerPage === 15 ? "teal" : "gray"}
          >
            15
          </Button>
          <Button
            onClick={() => handleStaffsPerPageChange(20)}
            colorScheme={staffsPerPage === 20 ? "teal" : "gray"}
          >
            20
          </Button>
          <Button
            onClick={() => handleStaffsPerPageChange(25)}
            colorScheme={staffsPerPage === 25 ? "teal" : "gray"}
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

export default StaffTable;
