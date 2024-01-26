import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  width: "50px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image src="/images/logos/jamiat-logo.svg" alt="logo" height={40} width={50} priority />
    </LinkStyled>
  );
};

export default Logo;
