"use client";

import { Box, Container, Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import HeroSection from "@/component/HeroSection/HeroSection";
import Sidebar from "./component/SideBar";

import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@chakra-ui/icons";
export default function WithSubnavigation() {
  const router = useRouter();
  return (
    <>
      <Sidebar />
      <Box w={"100vh"} bg="black"  h="40vh"/>
    </>
  );
}
