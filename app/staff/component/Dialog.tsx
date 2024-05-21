"use client";
import {
  Box,
  Select,
  Input,
  Text,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Textarea,
  useToast,
} from "@chakra-ui/react";


import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import { useSendEmployeeRequestMutation } from "@/app/_lib/features/api/apiSlice"
import getFromLocalStorage from "@/app/_lib/getFromLocalStorage";

type FormData = {
  employeePhone: string,
  permissions: string[],
  view: string,
  create: string,
  update: string,
  manage: string,
}

export default function AddressSelect() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormData>()

  const [sendEmployeeRequest, {isLoading}] = useSendEmployeeRequestMutation();

  useEffect(() => {
    if(isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset])

  const onSubmit = async (data: FormData) => {
    data.permissions = [data.view, data.create, data.update, data.manage];
    data.permissions = data.permissions.filter((p) => typeof p === 'string');
    const { view, create, update, manage, ...sendData } = data;
    let isSuccess: boolean = true;
    try {
      await sendEmployeeRequest(sendData).unwrap();
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error('Failed to send request: ', err)
      toast({
        title: 'Có lỗi khi gửi yêu cầu',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      if(isSuccess) {
        toast({
          title: 'Gửi yêu cầu thành công',
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  return (
    <>
      <Button m={{ base: 2, md: 8 }}  color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  sx={{
                    '@media (hover: hover)': {
                      _hover: {
                        backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                      }
                    }
                  }} onClick={onOpen}>
        Thêm nhân viên
      </Button>
      
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={{base: 'sm', md: 'md'}}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm nhân viên</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              <Input my={4} placeholder={"Số điện thoại"} {...register('employeePhone', {
                required: 'Trường này không được bỏ trống',
                pattern: {
                  value: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                  message: 'Số điện thoại không hợp lệ'
                }
                
              })}/>
              {errors.employeePhone && <Text color="red.500" mb={2} mt={-2}>{errors.employeePhone.message}</Text>}
              {/* <Input mt={4} placeholder={"Họ và tên"} /> */}
              {/* Dropdown chọn thành phố */}
              
              {/* <Select
                my={4}
                placeholder="Chọn cửa hàng"
                // value={selectedCity}
                // onChange={handleCityChange}
                variant="filled"
              >
                <option value="" disabled hidden>
                  Chọn cửa hàng
                </option>
                
                  <option value="1">Cửa hàng 1</option>
                  <option value="2">Cửa hàng 2</option>
                  <option value="3">Cửa hàng 3</option>
                
              </Select>   */}
              <div className="flex gap-4">  
                <Checkbox 
                  defaultChecked
                  value='VIEW_ONLY'
                  {...register('view')}
                >
                  Xem đơn
                </Checkbox>
                <Checkbox 
                  defaultChecked 
                  value='CREATE_ORDER'
                  {...register('create')}
                >
                  Tạo đơn
                </Checkbox>

                <Checkbox value='UPDATE_ORDER' {...register('update')}>Cập nhật</Checkbox>
                <Checkbox value='MANAGE_ORDER' {...register('manage')}>Quản lý</Checkbox>
              </div>         
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Hủy
            </Button>
            {isSubmitting ? (
              <Button
                isLoading
                loadingText='Đang gửi'
                color="white"
                backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                sx={{
                  '@media (hover: hover)': {
                    _hover: {
                      backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                    }
                  }
                }}
              >
                Gửi yêu cầu
              </Button>
            ) : (
            <Button  color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  sx={{
                    '@media (hover: hover)': {
                      _hover: {
                        backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                      }
                    }
                  }} onClick={handleSubmit(onSubmit)}>
              Gửi yêu cầu
            </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}