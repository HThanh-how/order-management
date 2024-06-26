import {
  Box,
  Select,
  Input,
  Text,
  Checkbox,
  Flex,
  Divider,
  Button,
  Stack,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  StackDivider,
  Badge,
  SkeletonText,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { ChangeEvent, useEffect, useState, useMemo, useRef } from "react";
import {
  useGetOrderDetailQuery,
  useGetOrderDetailForEmployeeQuery,
  useEditOrderStatusMutation,
  useEditOrderStatusForEmployeeMutation,
} from "@/app/_lib/features/api/apiSlice";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ReceiverDialog from "@/app/table/component/EditDialog";
import { useAppSelector } from "@/app/_lib/hooks";
import {
  Page,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";
import MyDocument from "./pdf";

import { TbArrowBackUp } from "react-icons/tb";

const steps = [
  { title: "Đơn hàng đang được xử lý", description: "Contact Info" },
  { title: "Đã lấy hàng", description: "Contact Info" },
  { title: "Đang giao", description: "Date & Time" },
  { title: "Giao thành công", description: "Select Rooms" },
];

import { chakra } from "@chakra-ui/react";

const GradientText = chakra("span", {
  baseStyle: {
    fontWeight: "bold",
    background: "linear-gradient(90deg, #ff5e09, #ff0348)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
});
export default function CustomerTable() {
  const [searchInput, setSearchInput] = useState("");
  const [receiver, setReceiver] = useState<any>(null);
  const params = useSearchParams();
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const receiverDialog = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const router = useRouter();
  const role = useAppSelector((state: any) => state.role.value);

  const {
    data: orderU,
    isLoading: isLoadingU,
    isSuccess: isSuccessU,
    isError: isErrorU,
    error: errorU,
  } = useGetOrderDetailQuery(Number(params?.get("id")), {
    skip: role === "ROLE_EMPLOYEE",
  });

  const {
    data: orderE,
    isLoading: isLoadingE,
    isSuccess: isSuccessE,
    isError: isErrorE,
    error: errorE,
  } = useGetOrderDetailForEmployeeQuery(Number(params?.get("id")), {
    skip: role !== "ROLE_EMPLOYEE",
  });

  const getOrder = useMemo(() => {
    if (isSuccessU) return orderU.data;
    if (isSuccessE) return orderE.data;
  }, [orderU, orderE]);

  const [editOrderStatus, {isLoading}] = useEditOrderStatusMutation();
  const [editOrderStatusForEmployee, {isLoading: isLoadingEmp}] = useEditOrderStatusForEmployeeMutation();

  useEffect(() => {
    if (isSuccessU || isSuccessE) {
      if (getOrder.orderStatus === "PROCESSING") setActiveStep(3);
      if (getOrder.orderStatus === "DELIVERED") setActiveStep(4);
      setReceiver(getOrder.receiverDto);
    }
    return;
  }, [orderU, orderE, isSuccessU, isSuccessE]);

  const handleCancelOrder = async (id: number) => {
    let isSuccess: boolean = true;
    try {
      if(role === 'ROLE_USER') {
        await editOrderStatus({
          newStatus: { newStatus: "CANCELLED" },
          id: id,
        }).unwrap();
      }
      else {
        await editOrderStatusForEmployee({
          newStatus: { newStatus: "CANCELLED" },
          id: id,
        }).unwrap();
      }
      
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error("Failed to cancel order: ", err);
      toast({
        title: "Có lỗi khi huỷ đơn hàng",
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      if (isSuccess) {
        setTimeout(() => router.push("/order"), 2000);
        toast({
          title: "Huỷ đơn hàng thành công",
          position: "top",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const handlePrintPDF = () => {
    console.log(orderU);
    setShowPDFViewer(true);
    return (
      <PDFViewer width="100%" height="600">
        <MyDocument order={orderU} />
      </PDFViewer>
    );
  };
  return (
    <>
      {isLoadingU || isLoadingE ? (
        <>
          <Flex
            justify="space-between"
            direction={"row"}
            bgColor={"white"}
            rounded={"2xl"}
          >
            <VStack m={{ base: 2, md: 8 }} alignItems={"flex-start"}>
              <SkeletonText noOfLines={2} width="300px" />
              <SkeletonText noOfLines={2} width="300px" />
            </VStack>
            <VStack m={{ base: 2, md: 8 }} alignItems={"flex-start"}>
              <SkeletonText noOfLines={2} width="300px" />
              <SkeletonText noOfLines={2} width="300px" />
            </VStack>

            <Flex
              alignItems="flex-start"
              justify="space-between"
              direction={{ base: "column", md: "row" }}
              gap={6}
              mt={6}
            >
              <Box w={"100%"} mt={6} bgColor={"white"} rounded={"2xl"}>
                <SkeletonText noOfLines={6} width="100%" />
              </Box>

              <Box w={"100%"} mt={6} bgColor={"white"} rounded={"2xl"}>
                <SkeletonText noOfLines={7} width="100%" />
              </Box>
            </Flex>

            <Flex
              alignItems="flex-start"
              justify="space-between"
              direction={{ base: "column", md: "row" }}
              gap={6}
              mt={6}
            >
              <Box w="75%" mt={6} bgColor={"white"} rounded={"2xl"}>
                <SkeletonText noOfLines={12} width="100%" />
              </Box>
              <VStack w={{ base: "100%" }}>
                <Box w="100%" mt={6} bgColor={"white"} rounded={"2xl"}>
                  <SkeletonText noOfLines={7} width="100%" />
                </Box>

                <Box mt={6} w="100%" bgColor={"white"} rounded={"2xl"}>
                  <SkeletonText noOfLines={5} width="100%" />
                </Box>
              </VStack>
            </Flex>
          </Flex>
        </>
      ) : isErrorU || isErrorE ? (
        <Flex
          alignItems="center"
          justify="center"
          direction={{ base: "column", md: "row" }}
          m={4}
        >
          <Alert w="25%" status="error">
            <AlertIcon />
            Can not fetch data from server
          </Alert>
        </Flex>
      ) : showPDFViewer ? (
        <>
          <Box display="flex" justifyContent="flex-end">
            <Button
              mb={4}
              mt={-4}
              backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
              sx={{
                "@media (hover: hover)": {
                  _hover: {
                    backgroundImage:
                      "linear-gradient(to right, #df5207, #d80740)",
                  },
                },
              }}
              size="md"
              onClick={() => setShowPDFViewer(false)}
            >
              <Icon as={TbArrowBackUp} boxSize="30px" color="white" />
            </Button>
          </Box>
          <PDFViewer width="100%" height="600">
            <MyDocument order={orderU} />
          </PDFViewer>
        </>
      ) : (
        <>
          <Flex
            justify="space-between"
            direction={"row"}
            bgColor={"white"}
            rounded={"2xl"}
          >
            <VStack
              m={{ base: 2, md: 8 }}
              alignItems={"flex-start"}
              // maxW={{ base: "80vw", md: "full" }}
            >
              <Text color={"gray"} fontSize={{ base: "lg", md: "xl" }}>
                Mã đơn hàng
              </Text>
              <GradientText>{getOrder.code}</GradientText>
            </VStack>
            <VStack
              m={{ base: 2, md: 8 }}
              alignItems={"flex-start"}
              // maxW={{ base: "80vw", md: "full" }}
            >
              <Text color={"gray"} fontSize={{ base: "lg", md: "xl" }}>
                Cập nhật lần cuối:
              </Text>
              <GradientText>{getOrder.lastUpdatedBy}</GradientText>
            </VStack>
          </Flex>

          <Flex
            alignItems="flex-start"
            justify="space-between"
            direction={{ base: "column", md: "row" }}
            gap={4}
            mt={4}
          >
            <Card w={"100%"} mt={4} bgColor={"white"} rounded={"2xl"}>
              <CardHeader>
                <Flex justify={"space-between"}>
                  <Heading size="md">
                    <GradientText>Vận chuyển từ</GradientText>
                  </Heading>
                  {/* {getOrder.orderStatus !== 'CANCELLED' && (
              // <EditIcon color="#ff0348" boxSize={6} style={{cursor: 'pointer'}} />
              )}
              */}
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex fontSize={"lg"}>
                  <Text fontWeight={"600"} mx={1}>
                    Tên cửa hàng:{" "}
                  </Text>
                  {getOrder.storeDto.name}
                </Flex>
                <Flex fontSize={"lg"}>
                  <Text fontWeight={"600"} mx={1}>
                    SĐT:
                  </Text>
                  {getOrder.storeDto.phoneNumber}
                </Flex>
                <Flex fontSize={"lg"}>
                  <Text fontWeight={"600"} mx={1} whiteSpace="nowrap">
                    Địa chỉ:
                  </Text>
                  <Text isTruncated>
                    {`${getOrder.storeDto.detailedAddress}, ${getOrder.storeDto.address}`}
                  </Text>{" "}
                </Flex>
              </CardBody>
            </Card>

            <Card w={"100%"} mt={4} bgColor={"white"} rounded={"2xl"}>
              <CardHeader>
                <Flex justify={"space-between"}>
                  <Heading size="md">
                    <GradientText>Thông tin người nhận</GradientText>
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex fontSize={"lg"}>
                  <Text fontWeight={"600"} mx={1}>
                    Tên người nhận:
                  </Text>
                  {getOrder.receiverDto.name}
                </Flex>
                <Flex fontSize={"lg"}>
                  <Text fontWeight={"600"} mx={1}>
                    SĐT:
                  </Text>
                  {getOrder.receiverDto.phoneNumber}
                </Flex>
                <Flex fontSize={"lg"}>
                  <Text fontWeight={"600"} mx={1} whiteSpace={"nowrap"}>
                    Địa chỉ:
                  </Text>
                  {`${getOrder.receiverDto.detailedAddress}, ${getOrder.receiverDto.address}`}
                </Flex>
                <Flex fontSize={"lg"}>
                  <Text fontWeight={"600"} mx={1} whiteSpace={"nowrap"}>
                    Ghi chú:
                  </Text>
                  {getOrder.receiverDto.note}
                </Flex>
              </CardBody>
            </Card>

            <ReceiverDialog
              isOpen={receiverDialog.isOpen}
              onOpen={receiverDialog.onOpen}
              onClose={receiverDialog.onClose}
              selectedCustomer={receiver}
            />
          </Flex>

          <Flex
            alignItems="flex-start"
            justify="space-between"
            direction={{ base: "column", md: "row" }}
            gap={4}
            mt={4}
          >
            <Card
              w={{ base: "100%", md: "75%" }}
              mt={4}
              bgColor={"white"}
              rounded={"2xl"}
            >
              <CardHeader>
                <Heading size="md" color="#ff0348">
                  <GradientText>Thông tin vận chuyển</GradientText>
                </Heading>
              </CardHeader>
              <CardBody>
                {getOrder.orderStatus === "CANCELLED" ? (
                  <Text color={"red.500"} fontWeight={600} fontSize={16}>
                    Đơn hàng này đã bị huỷ
                  </Text>
                ) : (
                  <Stepper
                    colorScheme="red"
                    index={activeStep}
                    orientation="vertical"
                  >
                    {steps.map((step, index) => (
                      <Step key={index}>
                        <StepIndicator>
                          <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                          />
                        </StepIndicator>

                        <Box flexShrink="0">
                          <StepTitle>{step.title}</StepTitle>
                          <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>
                )}
              </CardBody>
            </Card>
            <VStack w={{ base: "100%" }}>
              <Card w="100%" mt={4} bgColor={"white"} rounded={"2xl"}>
                <CardHeader>
                  <Heading size="md">
                    <GradientText>Sản phẩm đã đặt</GradientText>
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    {getOrder.orderItemDtos.map((order: any) => (
                      <HStack
                        key={order.id}
                        spacing={4}
                        justifyContent={"space-between"}
                      >
                        <Flex alignItems="center" gap={4}>
                          <Image
                            src={order.product.photoUrl}
                            width={80}
                            height={60}
                            alt="product image"
                          />
                          <Heading size="xs" textTransform="uppercase">
                            {order.product.name}
                          </Heading>
                        </Flex>
                        <VStack>
                          <Text>
                            {Number(order.price).toLocaleString("vi-VN")} VNĐ
                          </Text>{" "}
                          <Text>Số lượng: {order.quantity}</Text>
                        </VStack>
                      </HStack>
                    ))}
                  </Stack>
                </CardBody>
              </Card>

              <Card mt={4} w="100%" bgColor={"white"} rounded={"2xl"}>
                <CardHeader>
                  <Heading size="md">
                    <GradientText>Thanh toán</GradientText>
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Flex fontSize={"lg"} justifyContent="space-between">
                    <Text fontWeight={"600"} mx={1}>
                      Tổng tiền hàng:
                    </Text>
                    <Text>
                      {getOrder.price?.itemsPrice.toLocaleString("vi-VN")} VNĐ
                    </Text>
                  </Flex>
                  <Flex fontSize={"lg"} justifyContent="space-between">
                    <Text fontWeight={"600"} mx={1}>
                      Phí ship:
                    </Text>
                    <Text>
                      {getOrder.price?.shippingFee.toLocaleString("vi-VN")} VNĐ
                    </Text>
                  </Flex>
                  <Flex fontSize={"lg"} justifyContent="space-between">
                    <Text fontWeight={"600"} mx={1}>
                      <GradientText>Thành tiền:</GradientText>
                    </Text>
                    <Text fontWeight={"600"}>
                      <GradientText>
                        {getOrder.price?.collectionCharge.toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VNĐ
                      </GradientText>
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
              <Flex mt={4} ml="auto">
                {getOrder.orderStatus !== "CANCELLED" && (
                  <Button
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
                    variant="outline"
                    onClick={onOpen}
                  >
                    Huỷ đơn
                  </Button>
                )}
                <Button
                  ml={4}
                  color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  onClick={handlePrintPDF}
                  sx={{
                    "@media (hover: hover)": {
                      _hover: {
                        backgroundImage:
                          "linear-gradient(to right, #df5207, #d80740)",
                      },
                    },
                  }}
                >
                  In PDF
                </Button>
              </Flex>
            </VStack>
          </Flex>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Huỷ đơn
                </AlertDialogHeader>

                <AlertDialogBody>
                  Bạn có chắc chắn muốn huỷ đơn hàng này?
                </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Huỷ
                    </Button>
                    <Button color="white"
                      backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                      sx={{
                        '@media (hover: hover)': {
                          _hover: {
                            backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                          }
                        }
                      }} 
                      isLoading={isLoading || isLoadingEmp}
                      onClick={() => handleCancelOrder(getOrder.id)} ml={3}>
                      Xác nhận
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
      )}
    </>
  );
}
