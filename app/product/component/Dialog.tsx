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
  HStack,
  InputGroup,
  Icon,
  useToast,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation, useAddProductForEmployeeMutation } from "@/app/_lib/features/api/apiSlice";
import getFromLocalStorage from "@/app/_lib/getFromLocalStorage";
import { useAppSelector } from "@/app/_lib/hooks";

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

export default function Dialog() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormData>();

  const [img, setImg] = useState<any>(null);
  const role: any = useAppSelector((state: any) => state.role.value);
  const [addProduct, { isLoading: isLoadingU }] = useAddProductMutation();
  const [addProductForEmployee, { isLoading: isLoadingE }] = useAddProductForEmployeeMutation();


  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  const validateFiles = (e: any) => {
    if (!e.target.files) return "Trường này không được bỏ trống";
    const value = e.target.files[0];
    const fsMb = value.size / (1024 * 1024);
    const MAX_FILE_SIZE = 10;
    if (fsMb > MAX_FILE_SIZE) {
      return "Max file size 10mb";
    }
    setImg(value);
  };

  const uploadImage = async (value: any) => {
    const formData = new FormData();
    formData.append("file", value);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/user/firebase/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getFromLocalStorage("accessToken")}`,
        },
        body: formData,
      }
    );
    return res.json();
  };

  const onSubmit = async (data: FormData) => {
    if (img) {
      const tmp = await uploadImage(img);
      data.photoUrl = tmp.base64;
    }

    let isSuccess: boolean = true;
    try {
      if(role === "ROLE_USER")
        await addProduct(data).unwrap();
      else await addProductForEmployee(data).unwrap();
      onClose();
    } catch (err: any) {
      isSuccess = false;
      console.error("Failed to save product: ", err);
      if (err?.data?.message === "ACCESS_DEFINED: not authorized!!")
        toast({
          title: "Bạn không có quyền thêm sản phẩm mới",
          position: "top",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      else
        toast({
          title: "Có lỗi khi thêm sản phẩm mới",
          position: "top",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    } finally {
      if (isSuccess) {
        toast({
          title: "Thêm sản phẩm mới thành công",
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Button
        m={{ base: 2, lg: 8 }}
        ml={-4}
        color="white"
        backgroundImage="linear-gradient(90deg, #ff5e09, #ff0348)"
        sx={{
          "@media (hover: hover)": {
            _hover: {
              backgroundImage: "linear-gradient(to right, #df5207, #d80740)",
            },
          },
        }}
        onClick={onOpen}
      >
        Tạo sản phẩm mới
      </Button>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={{ base: "sm", md: "2xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo sản phẩm mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
              gap={4}
              pr={{base:2, md:0}}
            >
              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={Boolean(
                    errors?.name?.type === "required" ||
                      errors?.name?.type === "maxLength"
                  )}
                >
                  <FormLabel>Tên hàng hóa</FormLabel>
                  <Input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Trường này không được bỏ trống",
                      maxLength: 30,
                    })}
                  />
                  <FormErrorMessage>
                    {(errors.name?.type === "required" &&
                      errors.name?.message) ||
                      (errors.name?.type === "maxLength" &&
                        "Không vượt quá 30 kí tự")}
                  </FormErrorMessage>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Hình ảnh sản phẩm</FormLabel>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={validateFiles}
                  ></input>
                  <FormErrorMessage>
                    {errors.photoUrl && errors?.photoUrl.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={Boolean(errors.weight)}
                  mt={4}
                >
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
                  <FormErrorMessage>
                    {errors.weight && errors.weight.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={Boolean(errors.price)}
                  mt={4}
                >
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
                  <FormErrorMessage>
                    {errors.price && errors.price.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl
                  isRequired
                  isInvalid={Boolean(errors.status)}
                  
                >
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
                  <FormErrorMessage>
                    {errors.status && errors.status.message}
                  </FormErrorMessage>
                </FormControl>

                <HStack spacing={{ base: 8, md: 2 }} mt={4}>
                  <FormControl isInvalid={Boolean(errors.length)}>
                    <FormLabel>Dài (cm)</FormLabel>
                    <Input
                    mt={2}
                      type="text"
                      {...register("length", {
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Giá trị phải là số",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.length && errors.length.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={Boolean(errors.width)}>
                    <FormLabel>Rộng(cm)</FormLabel>
                    <Input
                    mt={2}
                      type="text"
                      {...register("width", {
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Giá trị phải là số",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.width && errors.width.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={Boolean(errors.height)}>
                    <FormLabel>Cao (cm)</FormLabel>
                    <Input
                    mt={2}
                      type="text"
                      {...register("height", {
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Giá trị phải là số",
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.height && errors.height.message}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                  
                <Textarea
                  mt={{base:4, md:7}}
                  maxLength={255}
                  placeholder="Mô tả chi tiết"
                  {...register("description")}
                />
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
                  "@media (hover: hover)": {
                    _hover: {
                      backgroundImage:
                        "linear-gradient(to right, #df5207, #d80740)",
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
    </>
  );
}
