"use client";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  SimpleGrid,
  Stack,
  Select,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  HStack,
  VStack,
  Button,
} from "@chakra-ui/react";
import Location from "./Location";
import ProductInfor from "./ProductInfor";
import {
  FiHome,
  FiTrendingUp,
  FiShoppingBag,
  FiStar,
  FiSettings,
  FiMenu,
  FiUser,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";



interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Tổng quan", icon: FiHome, link: "/dashboard" },
  { name: "Nhân sự", icon: FiUser, link: "/staff" },
  { name: "Sản phẩm", icon: FiShoppingBag, link: "/product" },
  { name: "Khách hàng", icon: FiStar, link: "/table" },
  { name: "Cài đặt", icon: FiSettings, link: "#" },
];

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();







  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <title>Tổng quan</title>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p={{base:2, md: 8}}>
                <Stack direction={{ base: "column", lg: "row" }}>
          <Box w={{ base: "80wv", lg: "50%" }} borderRadius={"xl"}>
            <Box p={4} bg="gray.50">
              <Text fontWeight={"700"}> Người gửi: </Text>
              <Select mt={4} placeholder="Địa chi nơi gửi" variant="filled">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
              <Checkbox m={4} colorScheme="green" defaultChecked>
                Nhận tại bưu cục
              </Checkbox>
            </Box>
            <Location />
          </Box>
          <Box w={{ base: "80wv", lg: "50%" }}>
            <ProductInfor />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          OrList
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Button onClick={()=>router.push("/create")}  m={4} w="8vw" colorScheme="green">+ Tạo đơn </Button>
      {LinkItems.map((link) => (
        <NavItem  
          key={link.name} 
          icon={link.icon}
          onClick={() => router.push(`${link.link}`)}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"

      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        OrList
      </Text>
    </Flex>
  );
};