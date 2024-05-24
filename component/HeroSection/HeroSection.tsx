import {
  Box,
  Tab,
  TabPanel,
  TabPanels,
  TabList,
  Tabs,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import Place from "./Estimate";
import { useDisclosure } from "@chakra-ui/react";
import PostOfficeLocation from "./PostOfficeLocation";
import axios, { AxiosError } from "axios";
interface OrderHistory {
  code: string;
  message: string;
  data: {
    actionDate: string;
    description: string;
  }[];
  timestamps: string;
}
const MyBox = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [orderCode, setOrderCode] = useState("");
  const [orderHistory, setOrderHistory] = useState<OrderHistory | null>(null); // if it's a state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleTabsChange = (index: number) => {
    setSelectedTab(index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderCode(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/order/history`,
        {
          params: { orderCode },
        }
      );
      setOrderHistory(response.data);
      onOpen();
      console.log("Response:", response.data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 400) {
        toast({
          title: "Đơn hàng không tồn tại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      w="full"
      h={{ base: "full", md: "93vh" }}
      backgroundImage="mainbg.webp"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box
        w={{ base: "80vw", md: "60vw" }}
        h={{ base: "190vw", md: "auto", lg: "30vw" }}
        mt={{ base: 2, md: 8 }}
        bg="gray.200"
        rounded={"lg"}
      >
        <Tabs
          isFitted
          variant="enclosed"
          colorScheme="green"
          size="lg"
          onChange={handleTabsChange}
        >
          <TabList>
            <Tab
              _selected={{
                color: "white",
                bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
              }}
              shadow={"xl"}
              borderColor={"gray.300"}
            >
              Mã vận đơn
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
              }}
              shadow={"xl"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              Ước tính chi phí
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bg: "linear-gradient(90deg, #ff5e09, #ff0348)",
              }}
              shadow={"xl"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              Tìm kiếm bưu cục
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex>
                <Input
                  m={4}
                  w={{ base: "90%", md: "40%" }}
                  variant="filled"
                  type="text"
                  placeholder="Nhập mã vận đơn"
                  maxLength={255}
                  value={orderCode}
                  onChange={handleInputChange}
                />
                <Button
                  m={4}
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
                  onClick={handleSearch}
                >
                  Tra cứu
                </Button>
              </Flex>

              {isOpen && (
                <VStack
                  m={4}
                  justifyContent={"flex-start"}
                  alignItems={"flex-start"}
                >
                  {orderHistory?.data.map((item, index) => (
                    <Flex key={index} color="teal">
                      {new Date(item.actionDate).toLocaleString()}:{" "}
                      <Text
                        ml={{ base: 2, md: 4 }}
                        color="black"
                        fontWeight={500}
                      >
                        {item.description}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              )}
            </TabPanel>
            <TabPanel>
              <Place />
            </TabPanel>
            <TabPanel>
              <PostOfficeLocation />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default MyBox;
