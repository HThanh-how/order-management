"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Avatar from "./components/UserAvatar";
import Profile from "./components/Profile";
import { 
  Text,
  useColorModeValue, 
  useDisclosure, 
  Box,
  CloseButton,
  Flex,
  Icon,
  BoxProps,
  FlexProps,
  Button,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import getFromLocalStorage from "../_lib/getFromLocalStorage";
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
import { useGetUserInfoQuery } from "../_lib/features/api/apiSlice";
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
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserInfoQuery(getFromLocalStorage('userId'))

  const getUser = useMemo (() => {
    if(isSuccess) return user.data
  }, [user])

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      
      {isLoading ? (
          <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          >
            <Spinner size='lg' color='orange.500' />
          </Flex>
        ) : isError ? (
          <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          m={4}
          >
            <Alert w='25%' status='error'>
              <AlertIcon />
              Can not fetch data from server
            </Alert>
          </Flex>
        ) : (
          <Box ml={{ base: 0, md: 60 }} p={{ base: 2, md: 8 }} display={{ base: 'block', md: 'flex' }}>
            <Avatar user={getUser}/>
            <Profile user={getUser}/>
          </Box>
        )}
        
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
      <Flex display={{ base: "flex", md: "none" }} h="20" alignItems="center" mx="10" justifyContent="right">
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
          bg: "orange.400",
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

