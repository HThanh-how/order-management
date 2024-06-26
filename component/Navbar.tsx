"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  BoxProps,
  FlexProps,
  CloseButton,
  Icon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  useToast,
  AvatarBadge,
  Divider,
  Tag,
  TagLabel,
  Switch,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, createContext } from "react";
import { usePathname } from "next/navigation";
import { BellIcon, CheckCircleIcon } from "@chakra-ui/icons";
// import { searchResults } from "./SearchBar";
import {
  FiHome,
  FiTrendingUp,
  FiShoppingBag,
  FiStar,
  FiSettings,
  FiMenu,
  FiUser,
  FiAirplay,
  FiShoppingCart,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText, useMemo } from "react";
import getFromLocalStorage from "@/app/_lib/getFromLocalStorage";
import {
  useGetEmployeesRequestQuery,
  useApproveEmployeeRequestMutation,
  useRejectEmployeeRequestMutation,
  useGetUserInfoQuery,
  useGetNotificationsQuery,
  useSetNotiIsReadMutation,
} from "@/app/_lib/features/api/apiSlice";
import { useAppSelector, useAppDispatch } from "@/app/_lib/hooks";
import { getRole, setRole } from "@/app/_lib/features/roles/roleSlice";
import { log } from "console";

interface Props {
  children: React.ReactNode;
}

export const IsLoginContext = createContext<boolean | null>(null);

const NavLink = (props: Props) => {
  const router = useRouter();
  const { children } = props;

  return (
    <Box
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.800", "gray.700"),
      }}
      onClick={() => router.push("/")}
      cursor={"pointer"}
    >
      {children}
    </Box>
  );
};

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Tổng quan", icon: FiHome, link: "/dashboard" },
  { name: "Đơn hàng", icon: FiShoppingCart, link: "/order" },
  { name: "Nhân sự", icon: FiUser, link: "/staff" },
  { name: "Cửa hàng", icon: FiAirplay, link: "/store" },
  { name: "Sản phẩm", icon: FiShoppingBag, link: "/product" },
  { name: "Khách hàng", icon: FiStar, link: "/table" },
];

export default function NavBar() {
  const [lastTimeAccess, setLastTimeAccess] = useState("2020");
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notification = useDisclosure();
  const toast = useToast();
  const pathname = usePathname();
  const [role, setRoleNavBar] = useState("ROLE_EMPLOYEE");
  const initalRole = useAppSelector((state) => state.role.value);
  const dispatch = useAppDispatch();
  const [prevNotifications, setPrevNotifications] = useState<any[]>([]);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    if (getFromLocalStorage("roles")?.includes("ROLE_EMPLOYEE")) {
      dispatch(getRole("ROLE_EMPLOYEE"));
      setIsEmployee(true);
      setRoleNavBar(initalRole);
      handleSwitchRole();
    }
  }, []);

  const handleSwitchRole = () => {
    const newRole = role === "ROLE_EMPLOYEE" ? "ROLE_USER" : "ROLE_EMPLOYEE";
    setRoleNavBar(newRole);
    dispatch(getRole(newRole));
  };

  const {
    data: user,
    isLoading: isLoadingU,
    isSuccess: isSuccessU,
    isError: isErrorU,
    error: errorU,
  } = useGetUserInfoQuery(getFromLocalStorage("userId"), { skip: !isLogin });

  const {
    data: employeeRequests,
    isLoading: isLoadingR,
    isSuccess: isSuccessR,
    isError: isErrorR,
    error: errorR,
  } = useGetEmployeesRequestQuery(1, { skip: !isLogin });

  const {
    data: notifications,
    isLoading: isLoadingN,
    isSuccess: isSuccessN,
    isError: isErrorN,
    error: errorN,
  } = useGetNotificationsQuery(1, { pollingInterval: 15000, skip: !isLogin });

  // const [approveEmployeeRequest] = useApproveEmployeeRequestMutation();
  // const [rejectEmployeeRequest] = useRejectEmployeeRequestMutation();
  const [setNotiIsRead] = useSetNotiIsReadMutation();

  const getEmployeeRequests = useMemo(() => {
    if (isSuccessR) return employeeRequests.data;
  }, [employeeRequests]);

  const getUser = useMemo(() => {
    if (isSuccessU) return user.data;
  }, [user]);

  const getNotifications = useMemo(() => {
    if (isSuccessN) {
      const tmp: any[] = [...notifications.data];
      const readNoti = tmp.filter((noti) => noti.read === true);
      const notReadNoti = tmp.filter((noti) => noti.read === false).reverse();
      return notReadNoti.concat(readNoti);
    }
  }, [notifications]);

  const checkForNewNotifications = (newNotifications: any[] | undefined) => {
    if (newNotifications === undefined) return;
    if (prevNotifications.length === 0) {
      setPrevNotifications(newNotifications);
      return;
    }

    const newNotificationCount =
      newNotifications.length - prevNotifications.length;
    if (newNotificationCount > 0) {
      toast({
        title: `Bạn có ${newNotificationCount} thông báo mới`,
        position: "top-right",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }

    setPrevNotifications(newNotifications);
  };

  const createdAt = new Date().toISOString();

  function convertISOToCustomFormat(isoDateString: string) {
    // Create a Date object from the ISO date string
    const date = new Date(isoDateString);

    // Get day, month, year, hours, and minutes
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert hours to 12-hour format and determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be converted to 12

    // Format day, month, hours, and minutes with leading zeros if needed
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Construct the final formatted string
    const formattedString = `${formattedDay}/${formattedMonth}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;

    return formattedString;
  }

  useEffect(() => {
    // const lastAccess = localStorage.getItem("createAt");
    if (localStorage.getItem("accessToken") === null) {
      setIsLogin(false);
    } else setIsLogin(true);
  }, []);

  useEffect(() => {
    if (
      (pathname === "/login" && isLogin) ||
      (pathname === "/register" && isLogin)
    ) {
      router.replace("/dashboard");
    }
  }, [pathname, isLogin]);

  useEffect(() => {
    if (isSuccessN) checkForNewNotifications(getNotifications);
    return;
  }, [getNotifications]);

  function handleLogout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("createdAt");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
    setIsLogin(false);
    window.location.href = "/login";
  }

  return (
    <IsLoginContext.Provider value={isLogin}>
      <Box
        bg={useColorModeValue("white.100", "#171717")}
        px={4}
        bgColor={"white"}
        textColor={"black"}
        borderBottom={"1px"}
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        shadow={"sm"}
        position="sticky" // Add this line
        top={0} // And this line
        zIndex={1}
        // bgGradient={'linear-gradient(90deg, #ff8a00, #ffeb37)'}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {/* <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        /> */}
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            // size="full"
          >
            <DrawerOverlay />
            <DrawerContent>
              <SidebarContent onClose={onClose} />
            </DrawerContent>
          </Drawer>
          <MobileNav
            display={{ base: "flex", md: "flex", lg: "none" }}
            onOpen={onOpen}
          />
          <HStack spacing={{ base: 4, md: 8 }} alignItems={"center"}>
            <Box
              ml={{ base: 0, md: 0, lg: 8 }}
              onClick={() => router.push("/")}
              cursor={"pointer"}
            >
              <Image
                src="/logo.png"
                alt="OrList"
                objectFit="cover" // or "contain"
                height={{base: '23px', md:"50px"}}
              />
            </Box>
          </HStack>

          <Flex alignItems={"center"} color="#171717">
            {isLogin ? (
              <>
                {pathname === "/" ? (
                  <Button
                    display={{ base: "none", md: "none", lg: "flex" }}
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
                    onClick={() => router.push("/dashboard")}
                    mx={2}
                    size={{ base: "sm", md: "md" }}
                  >
                    Trang tổng quan
                  </Button>
                ) : (
                  <Flex
                    m={2}
                    display={isEmployee ? { base: "none", lg: "flex" } : "none"}
                  >
                    <Text m={1} fontWeight={"bold"}>
                      Nhân viên
                    </Text>
                    <Switch
                      m={2}
                      colorScheme="green"
                      onChange={handleSwitchRole}
                      isChecked={role === "ROLE_EMPLOYEE"}
                    />
                  </Flex>
                )}
                <Menu>
                  <Avatar
                    size="sm"
                    bgColor={"white"}
                    cursor={"pointer"}
                    icon={<BellIcon boxSize={7} color="orange" />}
                    onClick={notification.onOpen}
                  >
                    {isSuccessN &&
                      getNotifications?.filter((noti) => noti.read === false)
                        .length !== 0 && (
                        <AvatarBadge boxSize="1.5em" bg="red">
                          {
                            getNotifications?.filter(
                              (noti) => noti.read === false
                            ).length
                          }
                        </AvatarBadge>
                      )}
                  </Avatar>
                  <Drawer
                    isOpen={notification.isOpen}
                    placement="right"
                    size={{ base: "sm", md: "md" }}
                    onClose={notification.onClose}
                  >
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader>Thông báo</DrawerHeader>
                      <DrawerBody>
                        {isLoadingN ? (
                          <Flex
                            alignItems="center"
                            justify="center"
                            direction={{ base: "column", md: "row" }}
                          >
                            <Spinner size="lg" color="orange.500" />
                          </Flex>
                        ) : isErrorN ? (
                          <Flex
                            alignItems="center"
                            justify="center"
                            direction={{ base: "column", md: "row" }}
                            m={4}
                          >
                            <Alert w="50%" status="error">
                              <AlertIcon />
                              Can not fetch data from server
                            </Alert>
                          </Flex>
                        ) : (
                          <>
                            {getNotifications?.length === 0 && (
                              <p>Không có thông báo nào</p>
                            )}
                            {getNotifications?.length !== 0 &&
                              getNotifications?.map((noti: any) => (
                                <VStack
                                  align={"start"}
                                  justifyContent={"flex-start"}
                                  mb={4}
                                  key={noti.id}
                                  cursor={"pointer"}
                                  onClick={async () => {
                                    if (noti.read === false)
                                      await setNotiIsRead(noti.id).unwrap();
                                    if (noti.type === "EMPLOYEE_REQUEST")
                                      router.push("/requests");
                                    if (noti.type === "ORDER_INFO")
                                      router.push("/order");
                                    // notification.onClose();
                                  }}
                                >
                                  <Flex gap={2}>
                                    {noti.read === false && (
                                      <CheckCircleIcon
                                        mt={2}
                                        color={"orange.500"}
                                      />
                                    )}
                                    <VStack
                                      align={"start"}
                                      justifyContent={"flex-start"}
                                    >
                                      <Text>{noti.message}</Text>
                                      <Text color={"gray.400"}>
                                        {convertISOToCustomFormat(
                                          noti.createdAt
                                        )}
                                      </Text>
                                    </VStack>
                                  </Flex>
                                  <Divider />
                                </VStack>
                              ))}
                          </>
                        )}
                      </DrawerBody>

                      {/* <DrawerFooter>
                    <Button variant='outline' mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='blue'>Save</Button>
                  </DrawerFooter> */}
                    </DrawerContent>
                  </Drawer>

                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                    ml={6}
                  >
                    {getFromLocalStorage("roles")?.includes("ROLE_EMPLOYEE") &&
                    role === "ROLE_EMPLOYEE" ? (
                      <Tag size="lg" colorScheme="red" borderRadius="full">
                        <Avatar
                          size={"xs"}
                          src={getUser?.avatar ? getUser.avatar : "male.svg"}
                          ml={-2}
                          mr={{ base: -2, lg: 0 }}
                        />
                        <TagLabel
                          ml={{ base: -1, lg: 2 }}
                          display={{ base: "none", lg: "block" }}
                        >
                          Nhân viên
                        </TagLabel>
                      </Tag>
                    ) : (
                      <Avatar
                        size={"sm"}
                        src={getUser?.avatar ? getUser.avatar : "male.svg"}
                      />
                    )}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => router.push("/user")}>
                      Cá nhân
                    </MenuItem>

                    <MenuItem onClick={() => router.push("/dashboard")}>
                      Quản lý
                    </MenuItem>
                    <MenuDivider />
                    <Flex
                      m={2}
                      display={isEmployee ? "flex" : "none"}
                      justifyContent="space-between"
                    >
                      <Text m={1} fontWeight={"bold"}>
                        Nhân viên
                      </Text>
                      <Switch
                        m={2}
                        colorScheme="green"
                        onChange={handleSwitchRole}
                        isChecked={role === "ROLE_EMPLOYEE"}
                      />
                    </Flex>
                    <MenuItem onClick={() => handleLogout()}>
                      Đăng xuất
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  mx={2}
                  borderColor={"#ff0348"}
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  backgroundClip="text"
                  color="transparent"
                  sx={{
                    transition: "all 0.3s",
                    "@media (hover: hover)": {
                      _hover: {
                        backgroundImage:
                          "linear-gradient(to right, #df5207, #d80740)",
                        textColor: "white",
                      },
                    },
                  }}
                  size={{ base: "sm", md: "md" }}
                  onClick={() => (window.location.href = "/register")}
                >
                  Đăng ký
                </Button>
                <Button
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
                  onClick={() => (window.location.href = "/login")}
                  mx={2}
                  size={{ base: "sm", md: "md" }}
                >
                  Đăng nhập
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    </IsLoginContext.Provider>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

  const router = useRouter();
  const pathname = usePathname();
  const role = useAppSelector((state) => state.role.value);
  console.log("Sidebar", role, typeof role);
  return (
    <Box

      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", lg: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        display={{ base: "flex", lg: "none" }}
        h="20"
        alignItems="center"
        mx="10"
        justifyContent="space-between"
      >
        <Image src="/logo.png" alt="OrList Logo" />
        <CloseButton onClick={onClose} />
      </Flex>
      <Button
        onClick={() => {
          onClose();
          router.push("/create");
        }}
        ml={8}
        mt={6}
        mb={2}
        color="white"
        backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
        sx={{
          "@media (hover: hover)": {
            _hover: {
              backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
            },
          },
        }}
      >
        <Text mx={4}>+ Tạo đơn</Text>
      </Button>
      {LinkItems.map((link) => {
        if (role === "ROLE_EMPLOYEE" && link.name === "Nhân sự") {
          return null;
        }

        return (
          <NavItem
            key={link.name}
            icon={link.icon}
            onClick={() => {
              onClose();
              router.push(`${link.link}`);
            }}
            bgGradient={
              link.link === pathname
                ? "linear-gradient(90deg, #ff5e09, #ff0348)"
                : ""
            }
            color={link.link === pathname ? "white" : ""}
          >
            {link.name}
          </NavItem>
        );
      })}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  const initalRole = useAppSelector((state) => state.role.value);
  console.log("Mobile navbar", initalRole);
  return (
    <Box
      as="a"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        w={{ base: "90%", md: "50%", lg: "none" }}
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

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    // const lastAccess = localStorage.getItem("createAt");
    if (localStorage.getItem("accessToken") === null) {
      setIsLogin(false);
    } else setIsLogin(true);
  }, []);
  return (
    <Flex 
      // display={"none"}
      ml={{ base: 0, lg: 60 }}
      px={{ base: 0, lg: 24 }}
      height="20"
      alignItems="center"
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
            display={isLogin ? "block" : "none"}
        variant="filled"
        onClick={onOpen}
        aria-label="open menu"
        color="black"
        icon={<FiMenu />}
      />
    </Flex>
  );
};
