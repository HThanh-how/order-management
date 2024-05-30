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
import { useEditEmployeePermissionMutation } from "@/app/_lib/features/api/apiSlice"
import getFromLocalStorage from "@/app/_lib/getFromLocalStorage";

type FormData = {
  permissions: string[],
  view: string,
  create: string,
  update: string,
  manage: string,
  create_product: string,
  update_product: string,
  create_store: string,
  update_store: string,
  create_receiver: string,
  update_receiver: string,
}

export default function EditDialog({ isOpen, onClose, id }: any) {
  const toast = useToast();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormData>()

  const [editEmployeePermission, {isLoading}] = useEditEmployeePermissionMutation();

  useEffect(() => {
    if(isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset])

  const onSubmit = async (data: FormData) => {
    data.permissions = [
      data.view, data.create, data.update, data.manage, 
      data.create_product, data.update_product, 
      data.create_store, data.update_store,  
      data.create_receiver, data.update_receiver
    ];
    data.permissions = data.permissions.filter((p) => typeof p === 'string');
    const { view, create, update, manage, create_product, update_product, create_store, update_store, create_receiver, update_receiver, ...sendData } = data;
    let isSuccess: boolean = true;
    try {
      await editEmployeePermission({newPermissions: sendData, id}).unwrap();
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error('Failed to edit permission: ', err)
      toast({
        title: 'Có lỗi khi thực hiện cập nhật',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      if(isSuccess) {
        toast({
          title: 'Cập nhật quyền thành công',
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
      {/* <Button m={{ base: 2, xl: 8 }}  color="white"
                  backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
                  sx={{
                    '@media (hover: hover)': {
                      _hover: {
                        backgroundImage: "linear-gradient(to right, #df5207, #d80740)"
                      }
                    }
                  }} onClick={onOpen}>
        Thêm nhân viên
      </Button> */}
      
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={{base: 'sm', md: 'md'}}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chỉnh sửa quyền</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
             <Box>
            {/*  <Input my={4} placeholder={"Số điện thoại"} {...register('employeePhone', {
                required: 'Trường này không được bỏ trống',
                pattern: {
                  value: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                  message: 'Số điện thoại không hợp lệ'
                }
                
              })}/> */}
              {/* {errors.employeePhone && <Text color="red.500" mb={2} mt={-2}>{errors.employeePhone.message}</Text>} */}
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
                  colorScheme="red"
                  value='VIEW_ONLY'
                  {...register('view')}
                >
                  Xem đơn
                </Checkbox>
                <Checkbox 
                  defaultChecked 
                  value='CREATE_ORDER'
                  {...register('create')}
                  colorScheme="red"
                >
                  Tạo đơn
                </Checkbox>

                <Checkbox value='UPDATE_ORDER' colorScheme="red" {...register('update')}>Cập nhật</Checkbox>
                <Checkbox value='MANAGE_ORDER' colorScheme="red" {...register('manage')}>Quản lý</Checkbox>
              </div>
              <div className="flex gap-4">  
                <Checkbox value='CREATE_PRODUCT' colorScheme="red" {...register('create_product')}>Tạo sản phẩm mới</Checkbox>
                <Checkbox value='UPDATE_PRODUCT' colorScheme="red" {...register('update_product')}>Cập nhật sản phẩm</Checkbox>
              </div>
              <div className="flex gap-4">  
                <Checkbox value='CREATE_STORE' colorScheme="red" {...register('create_store')}>Tạo cửa hàng mới</Checkbox>
                <Checkbox value='UPDATE_STORE' colorScheme="red" {...register('update_store')}>Cập nhật cửa hàng</Checkbox>
              </div>  
              <div className="flex gap-4">  
                <Checkbox value='CREATE_RECEIVER' colorScheme="red" {...register('create_receiver')}>Thêm khách hàng mới</Checkbox>
                <Checkbox value='UPDATE_RECEIVER' colorScheme="red" {...register('update_receiver')}>Cập nhật khách hàng</Checkbox>
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
                Cập nhật
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
              Cập nhật
            </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}