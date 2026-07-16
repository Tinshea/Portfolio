import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "@/navigation";

interface SeeMoreButtonProps {
  hrefstring: string;
}

// Cast back to `typeof Button` - styled() otherwise drops MUI's polymorphic
// `component` prop typing, which we need to render this as a locale-aware <a>.
const AnimatedButton = styled(Button)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    "& .arrow-icon": {
      transform: "translateX(20%)",
    },
  },
  "& .arrow-icon": {
    transition: "transform 0.3s ease",
    transform: "translateX(0)",
    marginLeft: theme.spacing(1),
  },
})) as typeof Button;

export default function SeeMoreButton(props: Readonly<SeeMoreButtonProps>) {
  const t = useTranslations("HomePage");

  return (
    <div>
      <Link href={props.hrefstring} passHref legacyBehavior>
        <AnimatedButton component="a" variant="text" color="primary">
          {t("seemore")}
          <ArrowForwardIcon className="arrow-icon" />
        </AnimatedButton>
      </Link>
    </div>
  );
}
