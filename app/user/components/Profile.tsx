import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Box,
} from "@chakra-ui/react";

interface ProfileProps {
  user: any;
}

function Profile({ user }: ProfileProps) {
  return (
    <Box
      as="main"
      flex={3}
      flexDir="column"
      justifyContent="space-between"
      p={5}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="gray.200"
    >
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        gap={6}
      >
        <FormControl>
          <FormLabel>Họ</FormLabel>
          <Input type="text" value={user?.firstName} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Tên</FormLabel>
          <Input type="text" value={user?.lastName} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Số điện thoại</FormLabel>
          <Input type="text" value={user?.phoneNumber} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={user?.email} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>Ngày sinh</FormLabel>
          <Input
            type="text"
            value={new Date(user?.dateOfBirth).toLocaleDateString("vi-VN")}
            readOnly
          />
        </FormControl>
      </Grid>
    </Box>
  );
}

export default Profile;
