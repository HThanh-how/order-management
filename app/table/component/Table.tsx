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
} from "@chakra-ui/react";
import { useState } from "react";

type User = {
  id: number;
  name: string;
  status: string;
  tags: string[];
  phoneNumber: string;
  address: string;
  note: string;
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

interface UserTableProps {
    users: User[];
  }
  
  const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [userSelections, setUserSelections] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const handleMasterCheckboxChange = () => {
    setCheckedAll(!checkedAll);

    if (!checkedAll) {
      const allUserIds = users.map((user) => user.id);
      setUserSelections(allUserIds);
    } else {
      setUserSelections([]);
    }
  };

  const handleCheckboxChange = (userId: number) => {
    if (userSelections.includes(userId)) {
      const updatedSelections = userSelections.filter(
        (selection) => selection !== userId
      );
      setUserSelections(updatedSelections);
    } else {
      setUserSelections([...userSelections, userId]);
    }
  };

  const paginateUsers = () => {
    const startingIndex = (currentPage - 1) * usersPerPage;
    const endingIndex = Math.min(startingIndex + usersPerPage, users.length);
    return users.slice(startingIndex, endingIndex);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCheckedAll(false);
      setUserSelections([]);
    } else {
      console.error('Invalid page number');
      
    }
  };

  const handleUsersPerPageChange = (perPage: number) => {
    setCurrentPage(1);
    setUsersPerPage(perPage);
    setCheckedAll(false);
    setUserSelections([]);
  };

  const totalPages = Math.ceil(users.length / usersPerPage);

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
            <Th>Tags</Th>
            <Th>Số điện thoại</Th>
            <Th>Địa chỉ</Th>
            <Th>Ghi chú</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginateUsers().map((user) => (
            <Tr key={user.id}>
              <Td>
                <Checkbox
                  isChecked={userSelections.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </Td>
              <Td>{user.name}</Td>
              <Td>{user.status}</Td>
              <Td>
                <Flex>
                  {user.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} mr={2} colorScheme="green">
                      {tag}
                    </Badge>
                  ))}
                  {user.tags.length > 3 && (
                    <Badge colorScheme="blue">+{user.tags.length - 3}</Badge>
                  )}
                </Flex>
              </Td>
              <Td>{user.phoneNumber}</Td>
              <Td>{user.address}</Td>
              <Td>{user.note}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justify="space-between" mt={4}>
        <ButtonGroup>
          <Button
            onClick={() => handleUsersPerPageChange(5)}
            colorScheme={usersPerPage === 5 ? "teal" : "gray"}
          >
            5
          </Button>
          <Button
            onClick={() => handleUsersPerPageChange(10)}
            colorScheme={usersPerPage === 10 ? "teal" : "gray"}
          >
            10
          </Button>
          <Button
            onClick={() => handleUsersPerPageChange(15)}
            colorScheme={usersPerPage === 15 ? "teal" : "gray"}
          >
            15
          </Button>
          <Button
            onClick={() => handleUsersPerPageChange(20)}
            colorScheme={usersPerPage === 20 ? "teal" : "gray"}
          >
            20
          </Button>
          <Button
            onClick={() => handleUsersPerPageChange(25)}
            colorScheme={usersPerPage === 25 ? "teal" : "gray"}
          >
            25
          </Button>
        </ButtonGroup>

        <Flex align="center">
          <Text>{`Page `}</Text>
          <Input mx={2}
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

export default UserTable;
