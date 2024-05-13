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
} from "@chakra-ui/react";
import { useState } from "react";
import Place from "./Estimate";
import { useDisclosure } from "@chakra-ui/react";

const MyBox = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleTabsChange = (index: number) => {
    setSelectedTab(index);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const handleCaptchaVerify: () => void = () => {
  //   if (captchaVerified) {
  //     // Xử lý khi reCAPTCHA được xác minh thành công
  //     // Gửi biểu mẫu hoặc thực hiện hành động mong muốn
  //     console.log('reCAPTCHA verified');
  //   } else {
  //     // Xử lý khi reCAPTCHA không được xác minh thành công
  //     console.log('reCAPTCHA verification failed');
  //   }
  // };

  // const handleCaptchaChange = (value: string) => {
  //   setCaptchaVerified(!!value);
  // };

  return (
    <Flex
      align="center"
      justify="center"
      w="full"
      h={{ base: 'full', md: "93vh" }}
      backgroundImage="https://images3.alphacoders.com/132/1328226.png"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box w={{ base: "80vw", md: "60vw" }} h={{ base: "190vw", md: "30vw" }} mt={{ base: 2, md: 8 }} bg="gray.200" rounded={"lg"}>
        <Tabs
          isFitted
          variant="enclosed"
          colorScheme="green"
          size="lg"
          onChange={handleTabsChange}
        >
          <TabList>
            <Tab
              _selected={{ color: "white", bg: "#f9a61a" }}
              shadow={"xl"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              Mã vận đơn
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#f9a61a" }}
              shadow={"xl"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              Ước tính chi phí
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#f9a61a" }}
              shadow={"xl"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              Bưu cục gần đó
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {/* Content of the first tab */}


              {/* <Box m={4}> <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY" data-callback={handleCaptchaChange}></div></Box> */}
              <Flex >
                <Input
                  m={4}
                  w={{ base: "90%", md: "40%" }}
                  variant="filled"
                  type="text"
                  placeholder="Nhập mã vận đơn"
                />
                <Button my={{ base: 2, md: 4 }} mx={{ base: 2, md: 4 }} color="white"
                  bgColor={"#f9a61a"} onClick={onOpen}>
                  Tra cứu
                </Button>
              </Flex>

              {isOpen && (
                <VStack m={4} justifyContent={"flex-start"} alignItems={"flex-start"}>
                  <Flex color="teal">
                    04/12/2023 00:12:43: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Đã tạo đơn hàng</Text>
                  </Flex>
                  <Flex color="teal">
                    04/12/2023 07:23:11: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Người lấy hàng chuẩn bị lấy hàng</Text>
                  </Flex>
                  <Flex color="teal">
                    04/12/2023 14:54:20: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Đã lấy hàng</Text>
                  </Flex>
                  <Flex color="teal">
                    04/12/2023 16:22:42: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Nhập kho Củ Chi</Text>
                  </Flex>
                  <Flex color="teal">
                    05/12/2023 08:19:28: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Vận chuyển từ kho Củ Chi đến kho Quận 10</Text>
                  </Flex>
                  <Flex color="teal">
                    05/12/2023  09:45:37: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Nhập kho Quận 10</Text>
                  </Flex>
                  <Flex color="teal">
                    05/12/2023 10:28:51: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Phân công giao hàng</Text>
                  </Flex>
                  <Flex color="teal">
                    05/12/2023 13:59:39: <Text ml={{ base: 2, md: 4 }} color="black" fontWeight={500}>Đã giao hàng</Text>
                  </Flex>
                </VStack>
              )}
            </TabPanel>
            <TabPanel>
              <Place />
            </TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default MyBox;
