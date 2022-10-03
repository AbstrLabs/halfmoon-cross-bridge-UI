import { Brightness4, Brightness7, BrightnessAuto } from "@mui/icons-material";
import { Tabs, Tab, IconButton, Box } from "@mui/material";
import React from 'react';
import { useTernaryDarkMode } from "usehooks-ts";
import {
  CONFIG,
  MAINNET_CONFIG,
  TESTNET_CONFIG,
  DEVELOPMENT_CONFIG
} from "../../api-deps/config"

// drop down imports
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

interface LinkTabProps {
  label: string;
  href: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // event.preventDefault();
      }}
      {...props}
    />
  );
}

export function Navbar() {
  const { ternaryDarkMode, toggleTernaryDarkMode } = useTernaryDarkMode();
  const url = window.location.pathname
  let value = url === "/" ? 0 :
    (url === "/bridge" || url === "/process" || url === "/result" ? 1 :
      (url === "/docs" ? 2 : 3)
    )
  console.log("CONFIG.configName from NavBar.tsx :", CONFIG.configName)

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <IconButton color="primary" onClick={toggleTernaryDarkMode}
        sx={{ position: "relative", paddingTop: "0", marginTop: "-5px" }}
      >
        {ternaryDarkMode === "dark" ? (
          <Brightness4 />
        ) : ternaryDarkMode === "light" ? (
          <Brightness7 />
        ) : (
          <BrightnessAuto />
        )}
      </IconButton>
      <Tabs value={value} aria-label="nav tabs example">
        <LinkTab label="Home" href="/" />
        <LinkTab label="Bridge" href="/bridge" />
        <LinkTab label="Docs" href={CONFIG.DocUrl} />
      </Tabs>
      <SplitButton />
    </Box>

  );
}

interface optionType {
  label: string;
  link: string;
}

const optionObj = {
  MAINNET: { label: 'MAINNET', link: MAINNET_CONFIG.HostUrl },
  TESTNET: { label: 'TESTNET', link: TESTNET_CONFIG.HostUrl },
  DEV: { label: 'DEV', link: DEVELOPMENT_CONFIG.HostUrl }
}

const options = [optionObj.MAINNET, optionObj.TESTNET, optionObj.DEV];

function SplitButton() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const displayName = () => {
    return CONFIG.configName
  }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
    option: optionType
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    window.location.replace(option.link)
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box sx={{ marginTop: "6px" }}>
        <ButtonGroup
          variant="text"
          ref={anchorRef}
          aria-label="split button">
          <Button>{displayName()}</Button>
          <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      </Box>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => {
                    if (option.label === 'DEV') { return null }
                    else {
                      return <MenuItem
                        key={index}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index, option)}
                      >
                        {option.label}
                      </MenuItem>
                    }
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
