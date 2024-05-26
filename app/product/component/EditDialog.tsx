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
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  HStack,
  useToast,
  Image,
  Center,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useEditProductMutation } from "@/app/_lib/features/api/apiSlice";
import getFromLocalStorage from "@/app/_lib/getFromLocalStorage";

type FormData = {
  name: string;
  photoUrl: string;
  status: string;
  price: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  description: string;
};

export default function EditDialog({ isOpen, onOpen, onClose, setProducts, selectedProduct }: any) {
  const {
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: selectedProduct.name || "",
      status: selectedProduct.status || "",
      price: selectedProduct.price || "",
      weight: selectedProduct.weight || "",
      length: selectedProduct.length || "",
      width: selectedProduct.width || "",
      height: selectedProduct.height || "",
      description: selectedProduct.description || "",
    },
  });

  const [editProduct, { isLoading }] = useEditProductMutation();
  const [img, setImg] = useState<any>(null);
  const toast = useToast();

  useEffect(() => {
    reset(selectedProduct);
  }, [selectedProduct]);

  const validateFiles = (e: any) => {
    if (e.target.files) {
      const value = e.target.files[0];
      const fsMb = value.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return 'Max file size 10mb';
      }
      setImg(value);
    }
    return;
  };

  const uploadImage = async (value: any) => {
    const formData = new FormData();
    formData.append('file', value);
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/user/firebase/image`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${getFromLocalStorage('accessToken')}`,
      },
      body: formData,
    });
    return res.json();
  };

  const onSubmit = async (data: FormData) => {
    if (img) {
      const tmp = await uploadImage(img);
      data.photoUrl = tmp.base64;
    }
    try {
      await editProduct(data).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to edit product: ', err);
      toast({
        title: 'Có lỗi khi sửa thông tin sản phẩm',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: 'Sửa thông tin sản phẩm thành công',
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'sm', md: '2xl' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sửa thông tin sản phẩm</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Center>
            <Image src={selectedProduct?.photoUrl}  height={'200px'} alt="product image" />
          </Center>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <GridItem>
              <FormControl mt={4}>
                <FormLabel>Hình ảnh sản phẩm</FormLabel>
                <input type="file" accept="image/png" onChange={validateFiles}></input>
                <FormErrorMessage>{errors.photoUrl && errors?.photoUrl.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={6} isRequired isInvalid={Boolean(errors?.name?.type === 'required' || errors?.name?.type === 'maxLength')}>
                <FormLabel>Tên hàng hóa</FormLabel>
                <Input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Trường này không được bỏ trống",
                    maxLength: 50,
                  })}
                />
                <FormErrorMessage>
                  {(errors.name?.type === "required" && errors.name?.message) ||
                    (errors.name?.type === "maxLength" && "Không vượt quá 50 kí tự")}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.weight)} mt={4}>
                <FormLabel>Trọng lượng (g)</FormLabel>
                <Input
                  type="text"
                  {...register("weight", {
                    required: "Trường này không được bỏ trống",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Giá trị phải là số",
                    },
                  })}
                />
                <FormErrorMessage>{errors.weight && errors.weight.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.price)} mt={4}>
                <FormLabel>Đơn giá (VNĐ)</FormLabel>
                <Input
                  type="text"
                  {...register("price", {
                    required: "Trường này không được bỏ trống",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Giá trị phải là số",
                    },
                  })}
                />
                <FormErrorMessage>{errors.price && errors.price.message}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired isInvalid={Boolean(errors.status)} mt={4}>
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  placeholder="Chọn trạng thái"
                  {...register("status", {
                    required: "Trường này không được bỏ trống",
                  })}
                >
                  <option value="AVAILABLE">CÒN HÀNG</option>
                  <option value="BACK_ORDER">DỰ TRỮ</option>
                  <option value="OUT_OF_STOCK">HẾT HÀNG</option>
                </Select>
                <FormErrorMessage>{errors.status && errors.status.message}</FormErrorMessage>
              </FormControl>

              <HStack spacing="10px" mt={3}>
                <FormControl isInvalid={Boolean(errors.length)}>
                  <FormLabel>Dài (cm)</FormLabel>
                  <Input
                    type="text"
                    {...register("length", {
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Giá trị phải là số",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.length && errors.length.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(errors.width)}>
                  <FormLabel>Rộng(cm)</FormLabel>
                  <Input
                    type="text"
                    {...register("width", {
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Giá trị phải là số",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.width && errors.width.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(errors.height)}>
                  <FormLabel>Cao(cm)</FormLabel>
                  <Input
                    type="text"
                    {...register("height", {
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Giá trị phải là số",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.height && errors.height.message}</FormErrorMessage>
                </FormControl>
              </HStack>
              <Text mt={4} fontWeight={500}>Mô tả chi tiết</Text>
              <Textarea mt={2} placeholder="Mô tả chi tiết" {...register("description")} />
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Huỷ
          </Button>
          {isSubmitting ? (
            <Button
              isLoading
              loadingText="Đang lưu"
              color="white"
              backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
              sx={{
                '@media (hover: hover)': {
                  _hover: {
                    backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
                  },
                },
              }}
            >
              Lưu
            </Button>
          ) : (
            <Button
              bgGradient="linear-gradient(90deg, #ff5e09, #ff0348)"
              color={"white"}
              _hover={{
                bgGradient: "linear-gradient(to right, #df5207, #d80740)",
                boxShadow: "xl",
              }}
              onClick={handleSubmit(onSubmit)}
            >
              Lưu
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
