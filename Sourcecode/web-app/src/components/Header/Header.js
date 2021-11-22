import React, {useState, useEffect} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import Menu from "@material-ui/icons/Menu";
import styles from "assets/jss/material-kit-react/components/headerStyle.js";
import { useTranslation } from "react-i18next";
import {
  Select,
  MenuItem,
} from '@material-ui/core';
import { useSelector } from "react-redux";
import moment from 'moment/min/moment-with-locales';

const useStyles = makeStyles(styles);

export default function Header(props) {
  const languagedata = useSelector(state => state.languagedata);
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [secondLogo,setSecondLogo] = React.useState(false);

  const { i18n } = useTranslation();
  const [langSelection, setLangSelection] = useState('en');
  const [multiLanguage,setMultiLanguage] = useState();

  const handleLanguageSelect = (event) => {
    i18n.changeLanguage(event.target.value);
    setLangSelection(event.target.value);
    moment.locale(event.target.value);
  };

  useEffect(()=>{
    if(languagedata.json){
      setMultiLanguage(languagedata.json);
    }
  },[languagedata])

  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
      setSecondLogo(true);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
      setSecondLogo(false);
    }
  };
  const { color, rightLinks, leftLinks, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  const brandComponent = <Button 
                              href="/"
                              className={classes.title}>
                              {secondLogo?<img src={require("../../assets/img/logo138x75black.png").default} alt="blackLogo"/>:
                                 <img src={require("../../assets/img/logo138x75white.png").default} alt="whiteLogo"/>
                              }
                         </Button>;
  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        {leftLinks !== undefined ? brandComponent : null}
        <div className={classes.flex}>
          {leftLinks !== undefined ? (
            <Hidden smDown implementation="css" style={{flexDirection:'row'}}>
              {leftLinks}
            </Hidden>
          ) : (
            brandComponent
          )}
        </div>
        <Hidden smDown implementation="css">
          {rightLinks}
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            {
              multiLanguage?
              <Select
                id="language-select"
                className={classes.input}
                value={langSelection}
                onChange={handleLanguageSelect}
                style={{backgroundColor:'#fff', width:'60px', marginRight:'20px'}}
              >
                {
                  Object.keys(multiLanguage).map((key)=> <MenuItem key={key} value={key}>
                  {key}
                  </MenuItem>)
                }
              </Select>
              :null}
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive}>
            {leftLinks}
            {rightLinks}
          </div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark",
      "header"
    ]).isRequired
  })
};
