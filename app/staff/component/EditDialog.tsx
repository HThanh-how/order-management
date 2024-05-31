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
  Flex,
} from "@chakra-ui/react";

import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditEmployeePermissionMutation } from "@/app/_lib/features/api/apiSlice";
import getFromLocalStorage from "@/app/_lib/getFromLocalStorage";

type FormData = {
  permissions: string[];
  view: string;
  create: string;
  update: string;
  manage: string;
  create_product: string;
  update_product: string;
  create_store: string;
  update_store: string;
  create_receiver: string;
  update_receiver: string;
};
import { Staff } from "@/app/type";
export default function EditDialog({
  isOpen,
  onClose,
  staff,
}: {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | undefined;
}) {
  const id = staff?.employeeId;
  console.log(id);
  const toast = useToast();

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    unregister,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormData>();

  const [editEmployeePermission, { isLoading }] =
    useEditEmployeePermissionMutation();

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  const viewOrder = watch("view");
  const createOrder = watch("create");
  const updateOrder = watch("update");
  const manageOrder = watch("manage");

  const [selectAllOrder, setSelectAllOrder] = useState(false);

  useEffect(() => {
    setSelectAllOrder(
      viewOrder === "VIEW_ONLY" &&
        createOrder === "CREATE_ORDER" &&
        updateOrder === "UPDATE_ORDER" &&
        manageOrder === "MANAGE_ORDER"
    );
  }, [viewOrder, createOrder, updateOrder, manageOrder]);

  const OrderPermissions = ({ register }: { register: any }) => {
    const handleSelectAllChange = () => {
      const newSelectAllOrder = !selectAllOrder;
      setSelectAllOrder(newSelectAllOrder);
      if (newSelectAllOrder) {
        setValue("view", "VIEW_ONLY");
        setValue("create", "CREATE_ORDER");
        setValue("update", "UPDATE_ORDER");
        setValue("manage", "MANAGE_ORDER");
      } else {
        unregister("view");
        unregister("create");
        unregister("update");
        unregister("manage");
      }
    };

    return (
      <Box m={4}>
        <Flex>
          <Text fontWeight={"bold"} ml={-2}>
            Đơn hàng
          </Text>
          <Checkbox
            ml={2}
            isChecked={selectAllOrder}
            colorScheme="green"
            onChange={handleSelectAllChange}
          />
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={4} ml={4}>
          <Checkbox value="VIEW_ONLY" colorScheme="red" {...register("view")}>
            Xem đơn
          </Checkbox>
          <Checkbox
            value="CREATE_ORDER"
            colorScheme="red"
            {...register("create")}
          >
            Tạo đơn
          </Checkbox>{" "}
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={4} ml={4}>
          <Checkbox
            value="UPDATE_ORDER"
            colorScheme="red"
            {...register("update")}
          >
            Cập nhật
          </Checkbox>
          <Checkbox
            value="MANAGE_ORDER"
            colorScheme="red"
            {...register("manage")}
            mr={1}
          >
            Quản lý
          </Checkbox>
        </Flex>
      </Box>
    );
  };

  const createProduct = watch("create_product");
  const updateProduct = watch("update_product");

  const [selectAllProduct, setSelectAllProduct] = useState(false);

  useEffect(() => {
    setSelectAllProduct(
      createProduct === "CREATE_PRODUCT" && updateProduct === "UPDATE_PRODUCT"
    );
  }, [createProduct, updateProduct]);
  const ProductPermissions = ({ register }: { register: any }) => {
    const handleSelectAllChange = () => {
      const newSelectAllProduct = !selectAllProduct;
      setSelectAllProduct(newSelectAllProduct);
      if (newSelectAllProduct) {
        setValue("create_product", "CREATE_PRODUCT");
        setValue("update_product", "UPDATE_PRODUCT");
      } else {
        unregister("create_product");
        unregister("update_product");
      }
    };

    return (
      <Box m={4} mt={8}>
        <Flex>
          <Text fontWeight={"bold"} ml={-2}>
            Sản phẩm
          </Text>
          <Checkbox
            ml={2}
            isChecked={selectAllProduct}
            colorScheme="green"
            onChange={handleSelectAllChange}
          />
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={4} ml={4}>
          <Checkbox
            value="CREATE_PRODUCT"
            colorScheme="red"
            {...register("create_product")}
          >
            Tạo mới
          </Checkbox>
          <Checkbox
            value="UPDATE_PRODUCT"
            colorScheme="red"
            {...register("update_product")}
          >
            Cập nhật
          </Checkbox>
        </Flex>
      </Box>
    );
  };

  const createStore = watch("create_store");
  const updateStore = watch("update_store");

  useEffect(() => {
    setSelectAllStore(
      createStore === "CREATE_STORE" && updateStore === "UPDATE_STORE"
    );
  }, [createStore, updateStore]);
  const [selectAllStore, setSelectAllStore] = useState(false);
  const StorePermissions = ({ register }: { register: any }) => {
    const handleSelectAllChange = () => {
      const newSelectAllStore = !selectAllStore;
      setSelectAllStore(newSelectAllStore);
      if (newSelectAllStore) {
        setValue("create_store", "CREATE_STORE");
        setValue("update_store", "UPDATE_STORE");
      } else {
        unregister("create_store");
        unregister("update_store");
      }
    };

    return (
      <Box m={4} mt={8}>
        <Flex>
          <Text fontWeight={"bold"} ml={-2}>
            Cửa hàng
          </Text>
          <Checkbox
            ml={2}
            isChecked={selectAllStore}
            colorScheme="green"
            onChange={handleSelectAllChange}
          />
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={4} ml={4}>
          <Checkbox
            value="CREATE_STORE"
            colorScheme="red"
            {...register("create_store")}
          >
            Tạo mới
          </Checkbox>
          <Checkbox
            value="UPDATE_STORE"
            colorScheme="red"
            {...register("update_store")}
          >
            Cập nhật
          </Checkbox>
        </Flex>
      </Box>
    );
  };

  const createReceiver = watch("create_receiver");
  const updateReceiver = watch("update_receiver");

  const [selectAllReceiver, setSelectAllReceiver] = useState(false);

  useEffect(() => {
    setSelectAllReceiver(
      createReceiver === "CREATE_RECEIVER" &&
        updateReceiver === "UPDATE_RECEIVER"
    );
  }, [createReceiver, updateReceiver]);

  const ReceiverPermissions = ({ register }: { register: any }) => {
    const handleSelectAllChange = () => {
      const newSelectAllReceiver = !selectAllReceiver;
      setSelectAllReceiver(newSelectAllReceiver);
      if (newSelectAllReceiver) {
        setValue("create_receiver", "CREATE_RECEIVER");
        setValue("update_receiver", "UPDATE_RECEIVER");
      } else {
        unregister("create_receiver");
        unregister("update_receiver");
      }
    };

    return (
      <Box m={4} mt={8}>
        <Flex>
          <Text fontWeight={"bold"} ml={-2}>
            Khách hàng
          </Text>
          <Checkbox
            ml={2}
            isChecked={selectAllReceiver}
            colorScheme="green"
            onChange={handleSelectAllChange}
          />
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={4} ml={4}>
          <Checkbox
            value="CREATE_RECEIVER"
            colorScheme="red"
            {...register("create_receiver")}
          >
            Thêm mới
          </Checkbox>
          <Checkbox
            value="UPDATE_RECEIVER"
            colorScheme="red"
            {...register("update_receiver")}
          >
            Cập nhật
          </Checkbox>
        </Flex>
      </Box>
    );
  };
  const onSubmit = async (data: FormData) => {
    data.permissions = [
      data.view,
      data.create,
      data.update,
      data.manage,
      data.create_product,
      data.update_product,
      data.create_store,
      data.update_store,
      data.create_receiver,
      data.update_receiver,
    ];
    data.permissions = data.permissions.filter((p) => typeof p === "string");
    const {
      view,
      create,
      update,
      manage,
      create_product,
      update_product,
      create_store,
      update_store,
      create_receiver,
      update_receiver,
      ...sendData
    } = data;
    let isSuccess: boolean = true;
    try {
      await editEmployeePermission({ newPermissions: sendData, id }).unwrap();
      onClose();
    } catch (err) {
      isSuccess = false;
      console.error("Failed to edit permission: ", err);
      toast({
        title: "Có lỗi khi thực hiện cập nhật",
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      if (isSuccess) {
        toast({
          title: "Cập nhật quyền thành công",
          position: "top",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  useEffect(() => {
    if (isOpen && staff) {
      const permissions = staff.permissions || [];
      if (permissions.includes("VIEW_ONLY")) setValue("view", "VIEW_ONLY");
      if (permissions.includes("CREATE_ORDER"))
        setValue("create", "CREATE_ORDER");
      if (permissions.includes("UPDATE_ORDER"))
        setValue("update", "UPDATE_ORDER");
      if (permissions.includes("MANAGE_ORDER"))
        setValue("manage", "MANAGE_ORDER");
      if (permissions.includes("CREATE_PRODUCT"))
        setValue("create_product", "CREATE_PRODUCT");
      if (permissions.includes("UPDATE_PRODUCT"))
        setValue("update_product", "UPDATE_PRODUCT");
      if (permissions.includes("CREATE_STORE"))
        setValue("create_store", "CREATE_STORE");
      if (permissions.includes("UPDATE_STORE"))
        setValue("update_store", "UPDATE_STORE");
      if (permissions.includes("CREATE_RECEIVER"))
        setValue("create_receiver", "CREATE_RECEIVER");
      if (permissions.includes("UPDATE_RECEIVER"))
        setValue("update_receiver", "UPDATE_RECEIVER");
    }
  }, [isOpen, staff, setValue]);
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
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chỉnh sửa quyền</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <OrderPermissions register={register} />
            <ProductPermissions register={register} />
            <StorePermissions register={register} />
            <ReceiverPermissions register={register} />
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Hủy
            </Button>
            {isSubmitting ? (
              <Button
                isLoading
                loadingText="Đang gửi"
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
                Cập nhật
              </Button>
            ) : (
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
                onClick={handleSubmit(onSubmit)}
              >
                Cập nhật
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
