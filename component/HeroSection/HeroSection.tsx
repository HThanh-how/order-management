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
} from "@chakra-ui/react";
import { useState } from "react";
import Place from "./Estimate";
import { useDisclosure } from '@chakra-ui/react'



const MyBox = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleTabsChange = (index: number) => {
    setSelectedTab(index);
  };
  const { isOpen, onOpen, onClose } = useDisclosure()


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
      h="95vh"
      backgroundImage="https://images3.alphacoders.com/132/1328226.png"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box w="60vw" h="30vw" mt={8} bg="gray.200" rounded={"lg"}>
        <Tabs
          isFitted
          variant="enclosed"
          colorScheme="green"
          size="lg"
          onChange={handleTabsChange}
        >
          <TabList>
            <Tab
              _selected={{ color: "white", bg: "green.400" }}
              shadow={"xl"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              Mã vận đơn
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "green.400" }}
              shadow={"xl"}
              border={"1px"}
              borderColor={"gray.300"}
            >
              Ước tính chi phí
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "green.400" }}
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
              <Input m={4} w={"40%"} variant='filled' type="text" placeholder="Nhập mã vận đơn" />
              {/* <Box m={4}> <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY" data-callback={handleCaptchaChange}></div></Box> */}
              <Button m={4} colorScheme='green' onClick={onOpen}>Tra cứu</Button>
              {isOpen && <Box m={4}><Text>Test</Text></Box>}
            </TabPanel>
            <TabPanel>
              <Place />
            </TabPanel>
            <TabPanel>
       
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default MyBox;
