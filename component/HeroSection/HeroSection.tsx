import {
  Box,
  Tab,
  TabPanel,
  TabPanels,
  TabList,
  Tabs,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import Place from "./Estimate";

const MyBox = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabsChange = (index: number) => {
    setSelectedTab(index);
  };

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
              <input type="text" placeholder="Nhập mã vận đơn" />
            </TabPanel>
            <TabPanel>
              <Place />
            </TabPanel>
            <TabPanel>
              {/* Content of the third tab */}
              {/* Place your OpenStreetMap component here */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default MyBox;
