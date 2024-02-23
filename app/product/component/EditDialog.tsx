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
} from "@chakra-ui/react";

import { useEffect, useState } from "react";


export default function EditDialog({ isOpen, onOpen, onClose, setProducts, selectedProduct }: any) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData({...selectedProduct});
  }, [selectedProduct])

  const handleChange = (e: { target: { name: any; value: any; } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const getProducts = async () => {
    await fetch("http://localhost:8082/api/v1/products", 
                {
                  method: 'GET',
                  headers: {
                    "Content-Type": "application/json",
                    "userId": '9a74d120-bd12-4e1b-b6da-80f74d70e178',
                  }
                
                })
    .then(data => data.json())
    .then(processedData => setProducts(processedData.data))
    .catch(error => console.log(error))

  }

  const onSubmit = async(event: any) => {
    event.preventDefault();
    
    await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}api/v1/products/${selectedProduct.id}`, 
                {
                  method: 'PUT',
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "userId": `${localStorage.getItem("userId")}`,
                  },
                  body: JSON.stringify(formData),
                
                })
    .then(data => data.json())
    .then(processedData => console.log(processedData.data))
    .catch(error => console.log(error))

    onClose();
    getProducts();
}

  return (
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sửa thông tin sản phẩm</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
            <FormControl isRequired>
              <FormLabel>Tên hàng hóa</FormLabel>
              <Input type='text' name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Ảnh</FormLabel>
              <Input type='text' name="photo" value={formData.photo} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Trọng lượng (g)</FormLabel>
              <Input type='text' name="weight" value={formData.weight} onChange={handleChange}/>
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Đơn giá (VNĐ)</FormLabel>
              <Input type='text' name="price" value={formData.price} onChange={handleChange}/>
            </FormControl>
            <FormControl mt={4}>
                <FormLabel>Trạng thái</FormLabel>
                <Select name="status" placeholder='Chọn trạng thái' onChange={handleChange}>
                    <option value="AVAILABLE">CÒN HÀNG</option>
                    <option value="BACK_ORDER">DỰ TRỮ</option>
                    <option value="OUT_OF_STOCK">HẾT HÀNG</option>
                </Select>
            </FormControl>
            <HStack spacing='16px' mt={4}>
              <FormControl>
                <FormLabel>Dài (cm)</FormLabel>
                <Input type='text' name="length" value={formData.length} onChange={handleChange}/>
              </FormControl>
              <FormControl>
                <FormLabel>Rộng (cm)</FormLabel>
                <Input type='text' name="width" value={formData.width} onChange={handleChange}/>
              </FormControl>
              <FormControl>
                <FormLabel>Cao (cm)</FormLabel>
                <Input type='text' name="height" value={formData.height} onChange={handleChange}/>
              </FormControl>
            </HStack>
            <Textarea mt={4} 
              placeholder="Mô tả chi tiết"
              name="description"
              value={formData.description} 
              onChange={handleChange}
            />
               
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="orange" onClick={onSubmit}>
              Save
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}