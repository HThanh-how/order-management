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

import {
  FiHome,
  FiTrendingUp,
  FiShoppingBag,
  FiStar,
  FiSettings,
  FiMenu,
  FiUser,
  FiAirplay,
  FiShoppingCart
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText, useState, useEffect } from "react";
import CustomerTable from "./component/Staff";
import { useAppSelector, useAppDispatch } from "@/app/_lib/hooks";
import { getRole } from "@/app/_lib/features/roles/roleSlice";


interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItemsU: Array<LinkItemProps> = [
  { name: "Tổng quan", icon: FiHome, link: "/dashboard" },
  { name: "Đơn hàng", icon: FiShoppingCart, link: "/order" },
  { name: "Nhân sự", icon: FiUser, link: "/staff" },
  { name: "Cửa hàng", icon: FiAirplay, link: "/store" },
  { name: "Sản phẩm", icon: FiShoppingBag, link: "/product" },
  { name: "Khách hàng", icon: FiStar, link: "/table" },
];

const LinkItemsE: Array<LinkItemProps> = [
  { name: "Tổng quan", icon: FiHome, link: "/dashboard" },
  { name: "Đơn hàng", icon: FiShoppingCart, link: "/order" },
  { name: "Cửa hàng", icon: FiAirplay, link: "/store" },
  { name: "Sản phẩm", icon: FiShoppingBag, link: "/product" },
  { name: "Khách hàng", icon: FiStar, link: "/table" },
];

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
          <title>Nhân viên</title>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "none", lg: "block" }}
      />
      {/* <Drawer
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
      </Drawer> */}
      {/* mobilenav */}
      {/* <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} /> */}
      <Box ml={{ base: 0, lg: 60 }} p={{ base: 2, lg: 8 }}>
        <CustomerTable/>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  const role = useAppSelector((state: any) => state.role.value);
  const [linkItems, setLinkItems] = useState<Array<LinkItemProps>>([]);
  // const LinkItems: Array<LinkItemProps> = role == "ROLE_USER" ? LinkItemsU : LinkItemsE;
  useEffect (() => {
    setLinkItems(role == "ROLE_USER" ? LinkItemsU : LinkItemsE)
  }, [role])

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
      <Flex display={{ base: "flex", md: "none" }} h="20" alignItems="center" mx="10" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          OrList
        </Text>
        <CloseButton  onClick={onClose} />
      </Flex>
      <Button onClick={()=>router.push("/create")}  ml={8} mt={6} mb={2} w="50%"                 bgGradient="linear-gradient(90deg, #ff5e09, #ff0348)"
                color={"white"}
                _hover={{
                  bgGradient: "linear-gradient(to right, #df5207, #d80740)",
                  boxShadow: "xl",
                }}>+ Tạo đơn </Button>
      {linkItems.map((link) => (
        <NavItem  
          key={link.name} 
          icon={link.icon}
          onClick={() => router.push(`${link.link}`)}
          bgGradient={link.name === "Nhân sự" ? "linear-gradient(90deg, #ff5e09, #ff0348)" : ""}
          color= {link.name === "Nhân sự" ? "white" : ""}
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
        m="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bgGradient: "linear-gradient(90deg, #ff5e09, #ff0348)",
          textColor: "white",
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

// interface MobileProps extends FlexProps {
//   onOpen: () => void;
// }
// const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
//   return (
//     <Flex
//       ml={{ base: 0, md: 60 }}
//       px={{ base: 4, md: 24 }}
//       height="20"
//       alignItems="center"
//       bg={useColorModeValue("white", "gray.900")}
//       borderBottomWidth="1px"
//       borderBottomColor={useColorModeValue("gray.200", "gray.700")}
//       justifyContent="flex-start"
//       {...rest}
//     >
//       <IconButton
//         variant="outline"
//         onClick={onOpen}
//         aria-label="open menu"
//         icon={<FiMenu />}
//       />

//       <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
//         OrList
//       </Text>
//     </Flex>
//   );
// };
