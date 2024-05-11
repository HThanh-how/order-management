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
} from "@chakra-ui/react";
import { EditIcon } from '@chakra-ui/icons'
import Image from 'next/image';
import { ChangeEvent, useEffect, useState, useMemo, useRef } from "react";
import { 
  useGetOrderDetailQuery,
  useGetOrderDetailForEmployeeQuery, 
  useEditOrderStatusMutation, 
} from "@/app/_lib/features/api/apiSlice";
import { useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation";
import ReceiverDialog from "@/app/table/component/EditDialog";
import { useAppSelector } from "@/app/_lib/hooks";

const steps = [
  { title: 'Đơn hàng đang được xử lý', description: 'Contact Info' },
  { title: 'Đã lấy hàng', description: 'Contact Info' },
  { title: 'Đang giao', description: 'Date & Time' },
  { title: 'Giao thành công', description: 'Select Rooms' },
]

export default function CustomerTable() {
  const [searchInput, setSearchInput] = useState("");
  const [receiver, setReceiver] = useState<any>(null);
  const params = useSearchParams();
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const receiverDialog  = useDisclosure();
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
} = useGetOrderDetailQuery(Number(params?.get("id")), {skip: role === "ROLE_EMPLOYEE"});

  const {
    data: orderE,
    isLoading: isLoadingE,
    isSuccess: isSuccessE,
    isError: isErrorE,
    error: errorE,
  } = useGetOrderDetailForEmployeeQuery(Number(params?.get("id")), {skip: role !== "ROLE_EMPLOYEE"});

  const getOrder = useMemo (() => {
    if (isSuccessU) return orderU.data;
    if (isSuccessE) return orderE.data;
  }, [orderU, orderE]);

  const [ editOrderStatus ] = useEditOrderStatusMutation();

  useEffect(() => {
    if(isSuccessU || isSuccessE) {
      if(getOrder.orderStatus === 'PROCESSING') setActiveStep(3);
      if(getOrder.orderStatus === 'DELIVERED') setActiveStep(4);
      setReceiver(getOrder.receiverDto);
    }
    return;
  }, [orderU, orderE, isSuccessU, isSuccessE])

  const handleCancelOrder = async (id: number) => {
    let isSuccess: boolean = true;
    try {
      await editOrderStatus({
        newStatus: {newStatus: "CANCELLED"},
        id: id,
      }).unwrap();
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error('Failed to cancel order: ', err)
      toast({
        title: 'Có lỗi khi huỷ đơn hàng',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      if(isSuccess) {
        setTimeout(() => router.push("/order"), 2000);
        toast({
          title: 'Huỷ đơn hàng thành công',
          position: 'top',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <>
      {isLoadingU || isLoadingE ? (
        <Flex
        alignItems="center"
        justify="center"
        direction={{ base: "column", md: "row" }}
        >
          <Spinner size='lg' color='orange.500' />
        </Flex>
      ) : isErrorU || isErrorE ? (
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
      <>
      <Flex
        justify="space-between"
        direction={ "row" }
        bgColor={"white"} rounded={"2xl"}
      >
        <VStack
          m={{ base: 2, md: 8 }}
          alignItems={"flex-start"}
          // maxW={{ base: "80vw", md: "full" }}
        >
          <Text color={"gray"} fontSize={{ base: "lg", md: "xl" }} >
            Mã đơn hàng
          </Text>
          <Text fontWeight={700} color="orange.500">{getOrder.code}</Text>
        </VStack>
        <VStack
          m={{ base: 2, md: 8 }}
          alignItems={"flex-start"}
          // maxW={{ base: "80vw", md: "full" }}
        >
          <Text color={"gray"} fontSize={{ base: "lg", md: "xl" }} >
            Cập nhật lần cuối:
          </Text>
          <Text fontWeight={700} color="orange.500">{getOrder.lastUpdatedBy}</Text>
        </VStack>
        
      </Flex>

      <Flex
        alignItems="flex-start"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
        mt={4}
      >
        <Card w={'100%'} mt={4} bgColor={"white"} rounded={"2xl"}>
          <CardHeader>
            <Flex justify={'space-between'}>
              <Heading size='md' color="orange.500">Vận chuyển từ</Heading>
              {/* {getOrder.orderStatus !== 'CANCELLED' && (
              // <EditIcon color="orange.500" boxSize={6} style={{cursor: 'pointer'}} />
              )}
              */}
            </Flex>
          </CardHeader>
          <CardBody>
            <Text fontSize={'lg'} fontWeight={400}>Tên cửa hàng: {getOrder.storeDto.name}</Text>
            <Text fontSize={'lg'} fontWeight={400}>SĐT: {getOrder.storeDto.phoneNumber}</Text>
            <Text fontSize={'lg'} fontWeight={400}>Địa chỉ: {`${getOrder.storeDto.detailedAddress}, ${getOrder.storeDto.address}`}</Text>
          </CardBody>
        </Card>

        <Card w={'100%'} mt={4} bgColor={"white"} rounded={"2xl"}>
          <CardHeader>
            <Flex justify={'space-between'}>
              <Heading size='md' color="orange.500">Thông tin người nhận</Heading>
              {getOrder.orderStatus !== 'CANCELLED' && (
              <EditIcon color="orange.500" boxSize={6} style={{cursor: 'pointer'}} onClick={receiverDialog.onOpen}/>
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            <Text fontSize={'lg'} fontWeight={400}>Tên người nhận: {getOrder.receiverDto.name}</Text>
            <Text fontSize={'lg'} fontWeight={400}>SĐT: {getOrder.receiverDto.phoneNumber}</Text>
            <Text fontSize={'lg'} fontWeight={400}>Địa chỉ: {`${getOrder.receiverDto.detailedAddress}, ${getOrder.receiverDto.address}`}</Text>
            <Text fontSize={'lg'} fontWeight={400}>Ghi chú: {getOrder.receiverDto.note}</Text>
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
        <Card w='75%' mt={4} bgColor={"white"} rounded={"2xl"}>
          <CardHeader>
            <Heading size='md' color="orange.500">Thông tin vận chuyển</Heading>
          </CardHeader>
          <CardBody>
          {getOrder.orderStatus === 'CANCELLED' ? (
            <Text color={'red.500'} fontWeight={600} fontSize={16}>Đơn hàng này đã bị huỷ</Text>
          )
          :
          <Stepper colorScheme="orange" index={activeStep} orientation='vertical' >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          }
          </CardBody>
        </Card>
        <VStack w={{base: '100%'}}>
          <Card w='100%' mt={4} bgColor={"white"} rounded={"2xl"}>
          <CardHeader>
            <Heading size='md' color="orange.500">Sản phẩm đã đặt</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
            {getOrder.orderItemDtos.map((order: any) => (
              <HStack key={order.id} spacing={4} justifyContent={'space-between'}>
                <Flex alignItems="center" gap={4}>
                  <Image
                    src={order.product.photoUrl}
                    width={80}
                    height={60}
                    alt="product image"
                  />
                  <Heading size='xs' textTransform='uppercase'>
                    {order.product.name}
                  </Heading>
                </Flex>
                <VStack>
                  <Text>{order.price} VNĐ</Text>
                  <Text>SL: {order.quantity}</Text>
                </VStack>
              </HStack>
            ))}
            </Stack>
          </CardBody>
          </Card> 

          <Card mt={4}  w='100%' bgColor={"white"} rounded={"2xl"}>
            <CardHeader>
              <Heading size='md' color="orange.500">Thanh toán</Heading>  
            </CardHeader>
            <CardBody>
              <Text fontSize={'lg'} fontWeight={400}>Tổng tiền hàng: {getOrder.price?.itemsPrice} VNĐ</Text>
              <Text fontSize={'lg'} fontWeight={400}>Phí ship: {getOrder.price?.shippingFee} VNĐ</Text>
              <Text fontSize={'lg'} fontWeight={400}>Thành tiền: {getOrder.price?.collectionCharge} VNĐ</Text>
            </CardBody>
          </Card>

          {getOrder.orderStatus !== 'CANCELLED' && (
          <Flex mt={4} alignItems={'center'} justifyContent={'flex-end'}>
            <Button colorScheme='orange' variant='outline' onClick={onOpen}>
              Huỷ đơn
            </Button>
          </Flex>
          )}
          
        </VStack>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Huỷ đơn
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn huỷ đơn hàng này?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Huỷ
              </Button>
              <Button colorScheme='orange' onClick={() => handleCancelOrder(getOrder.id)} ml={3}>
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
