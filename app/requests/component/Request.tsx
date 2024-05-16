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
  Container,
  InputGroup,
  InputLeftElement,
  RadioGroup,
  Radio,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import { Staff } from "@/app/type";
import { 
  useGetAllRequestOfOwnerQuery, 
  useGetEmployeesRequestQuery,
  useApproveEmployeeRequestMutation,
  useRejectEmployeeRequestMutation,
} from "@/app/_lib/features/api/apiSlice";
import { useAppSelector, useAppDispatch } from "@/app/_lib/hooks";
import { getRole } from "@/app/_lib/features/roles/roleSlice";
import { useRouter } from "next/navigation";


export default function CustomerTable() {
  const role = useAppSelector((state: any) => state.role.value);
  const dispatch = useAppDispatch();
  const [approveEmployeeRequest] = useApproveEmployeeRequestMutation();
  const [rejectEmployeeRequest] = useRejectEmployeeRequestMutation();
  const toast = useToast();
  const [selectedReq, setSelectedReq] = useState<any>({});
  const {onOpen, onClose, isOpen} = useDisclosure();
  const router = useRouter();

  const {
    data: requests,
    isLoading: isLoadingR,
    isSuccess: isSuccessR,
    isError: isErrorR,
    error: errorR,
  } = useGetAllRequestOfOwnerQuery(1, {skip: role === "ROLE_EMPLOYEE"}) 

  const {
    data: requestsE,
    isLoading: isLoadingE,
    isSuccess: isSuccessE,
    isError: isErrorE,
    error: errorE,
  } = useGetEmployeesRequestQuery(1) 


  const getRequests = useMemo (() => {
    let result: any = []
    if (isSuccessR) result = result.concat(requests.data)
    if (isSuccessE) result = result.concat(requestsE.data);
    return result;
  }, [requests, requestsE])

  const handleApproveRequest = async (request: any) => {
    try {
      await approveEmployeeRequest({
        id: request.id, 
        request: {
          employeeId: request.employeeId,
          permissions: request.permissions,
        }
        })
      .unwrap();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("createdAt");
      localStorage.removeItem("userId");
      localStorage.removeItem("roles");
      router.replace("/login");
    } catch (err) {
      console.error('Failed to send request: ', err)
      toast({
        title: 'Có lỗi khi gửi yêu cầu',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } 
  }

  const handleRejectRequest = async (request: any) => {
    try {
      const res = await rejectEmployeeRequest({
        id: request.id, 
        request: {
          employeeId: request.employeeId,
          permissions: request.permissions,
        }
        })
      .unwrap();
      window.location.reload();
    } catch (err) {
      console.error('Failed to send request: ', err)
      toast({
        title: 'Có lỗi khi gửi yêu cầu',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } 
  }

  const handleOpen = async (req: any) => {
    setSelectedReq(req);
    onOpen();
  }

  return (
    <TableContainer bgColor={"white"} rounded={"2xl"}>
      
      <Card>
        <CardHeader>
          <Heading size='md'>Danh sách yêu cầu</Heading>
        </CardHeader>

        <CardBody>
          
          {isLoadingR || isLoadingE ? (
            <Flex
            alignItems="center"
            justify="center"
            direction={{ base: "column", md: "row" }}
            >
              <Spinner size='lg' color='#ff0348' />
            </Flex>
          ) : isSuccessR || isSuccessE ?(
            <Stack divider={<StackDivider />} spacing='4'>
              {getRequests.length === 0 && (
                <p>Không có yêu cầu nào</p>
              )}
              {getRequests.length !== 0 && (
                getRequests.map((req: any) => (
                <Box key={req.id}>
                  <Heading size='xs' textTransform='uppercase'>
                    Tóm tắt
                  </Heading>
                  <Text pt='2' fontSize='sm' style={{ display: 'flex', flexWrap: 'wrap' }}>
                    Quyền: {req.permissions.map((tag: any, index: any  ) => (
                    <div key={index}>
                      {tag === "VIEW_ONLY" && (
                        <Badge ml={2} colorScheme="gray">
                          XEM ĐƠN
                        </Badge>
                      )}
      
                      {tag === "MANAGE_ORDER" && (
                        <Badge ml={2} colorScheme="red">
                          QUẢN LÝ
                        </Badge>
                      )}
      
                      {tag === "UPDATE_ORDER" && (
                        <Badge ml={2} colorScheme="blue">
                          CẬP NHẬT
                        </Badge>
                      )}

                      {tag === "CREATE_ORDER" && (
                        <Badge ml={2} colorScheme="green">
                          TẠO ĐƠN
                        </Badge>
                      )}
                    </div>
                    ))}
                  </Text>
                  <Text pt='2' fontSize='sm'>
                    Trạng thái: 
                    {req.status === "PENDING" && (
                      <Badge ml={2} colorScheme="gray">
                        ĐANG CHỜ
                      </Badge>
                    )}
    
                    {req.status === "REJECTED" && (
                      <Badge ml={2} colorScheme="red">
                        TỪ CHỐI
                      </Badge>
                    )}
    
                    {req.status === "ACCEPTED" && (
                      <Badge ml={2} colorScheme="green">
                        CHẤP NHẬN
                      </Badge>
                    )}
                  </Text>
                  {req.status === "PENDING" && (
                    <HStack mt={4} justifyContent={'flex-end'}>
                    <Button
                      borderColor={"#ff0348"}
                      backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                      backgroundClip="text"
                      color="transparent"
                      sx={{
                        transition: "all 0.3s",
                        '@media (hover: hover)': {
                          _hover: {
                            backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
                            textColor: "white",
    
                          }
                        }
                      }}
                      variant='outline'
                      mx={2}
                      size={'sm'}
                      onClick={() => handleRejectRequest(req)}
                    >
                      Từ chối
                    </Button>
                    <Button
                                        color="white"
                                        backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                                        sx={{
                                          '@media (hover: hover)': {
                                            _hover: {
                                              backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                                            }
                                          }
                                        }}
                      onClick={() => handleOpen(req)}
                      mx={2}
                      size={'sm'}
                    >
                      Chấp nhận
                    </Button>
                  </HStack>
                  )}
                  
                  
                </Box>
                ))
              )}
              <Modal onClose={onClose} isOpen={isOpen} isCentered size={{base: 'sm', md: 'md'}}>
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                      Để chấp nhận hệ thống sẽ đăng xuất, bạn vui lòng đăng nhập lại để tiếp tục.
                  </ModalBody>
                  <ModalFooter>
                    <Button 
                      mr={3} 
                      onClick={() => {
                        setSelectedReq({});
                        onClose();
                      }}
                    >
                      Đóng
                    </Button>
                    <Button                   color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  sx={{
                    '@media (hover: hover)': {
                      _hover: {
                        backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                      }
                    }
                  }} onClick={() => handleApproveRequest(selectedReq)}>Xác nhận</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Stack>
          ) : (
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
          )}
          
        </CardBody>
      </Card>
      
    </TableContainer>
  );
}
