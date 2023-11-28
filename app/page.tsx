"use client";

import { Box, Container, Flex, Icon, Text } from "@chakra-ui/react";
import HeroSection from "@/component/HeroSection/HeroSection";

import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@chakra-ui/icons";
export default function WithSubnavigation() {
  const router=useRouter()
  return (
    <>
    <title>Arcelity</title>
    <meta name="description" content="Home"></meta>
    
      <HeroSection />



      <Container p={0} maxW={{ base: "90%", lg: "75%" }} my={10}>
        <Flex>
        </Flex>
      </Container>
    </>
  );
}
