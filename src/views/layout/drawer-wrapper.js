import React, {useEffect, useRef, useState} from "react";
import {Appbar, Drawer} from "react-native-paper";
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {View, SafeAreaView, Image, Platform, StatusBar} from "react-native";
import {CenteredContent, Container} from "../../components/shared-styled-components";
import styled from "styled-components/native";
import LogoImage from '../../assets/logo.png'
import {useDispatch} from "react-redux";
import {clear} from "../../redux/actions/userActions";
import Dashboard from "../partials/dashboard";
import Transactions from "../partials/transactions";
import Categories from "../partials/categories";
import Tags from "../partials/tags";
import ImportanceLevels from "../partials/importance-levels";
import Templates from "../partials/templates";
import RecurringTransactions from "../partials/recurring-transactions";
import Guards from "../partials/guards";
import SavingsGoals from "../partials/savings-goals";
import Account from "../partials/account";
import Help from "../partials/help";

const Logo = styled(Image)`
  max-height: 40px;
  aspect-ratio: 1;
  width: 80%;
  resize-mode: contain;
`

const LogoContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: 15px;
`

const pagesData = {
  "dashboard": {
    title: "Dashboard",
    description: "Overview of your data"
  },
  "transactions": {
    title: "Transactions",
    description: "View your transactions"
  },
  "categories": {
    title: "Categories",
    description: "Manage your categories"
  },
  "tags": {
    title: "Tags",
    description: "Manage your tags"
  },
  "importance-levels": {
    title: "Importance Levels",
    description: "Manage importance levels"
  },
  "templates": {
    title: "Templates",
    description: "Manage transaction templates"
  },
  "recurring-transactions": {
    title: "Recurring Transactions",
    description: "Automate recurring transactions"
  },
  "guards": {
    title: "Guards",
    description: "Manage your guards"
  },
  "saving-goals": {
    title: "Saving Goals",
    description: "Manage saving targets"
  },
  "account": {
    title: "Account",
    description: "Manage your profile"
  },
  "help": {
    title: "Help",
    description: "How it works"
  }
}

const DrawerWrapper = () => {
  const drawer = useRef()
  const dispatch = useDispatch()
  const [active, setActive] = useState('dashboard')
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const handleDrawerSlide = (status) => {
    //
  };

  useEffect(() => {
    setTitle(pagesData[active].title)
    setDescription(pagesData[active].description)
    drawer.current.closeDrawer()
  }, [active])

  const renderDrawer = () => {
    return (
      <SafeAreaView>
        <Drawer.Section>
          <LogoContainer>
            <Logo source={LogoImage}/>
          </LogoContainer>
        </Drawer.Section>
        <Drawer.Section>
          <Drawer.Item
            label="Dashboard"
            active={active === 'dashboard'}
            onPress={() => setActive('dashboard')}
          />
          <Drawer.Item
            label="Transactions"
            active={active === 'transactions'}
            onPress={() => setActive('transactions')}
          />
          <Drawer.Item
            label="Categories"
            active={active === 'categories'}
            onPress={() => setActive('categories')}
          />
          <Drawer.Item
            label="Tags"
            active={active === 'tags'}
            onPress={() => setActive('tags')}
          />
          <Drawer.Item
            label="Importance Levels"
            active={active === 'importance-levels'}
            onPress={() => setActive('importance-levels')}
          />
          <Drawer.Item
            label="Templates"
            active={active === 'templates'}
            onPress={() => setActive('templates')}
          />
          <Drawer.Item
            label="Recurring"
            active={active === 'recurring-transactions'}
            onPress={() => setActive('recurring-transactions')}
          />
          <Drawer.Item
            label="Guards"
            active={active === 'guards'}
            onPress={() => setActive('guards')}
          />
          <Drawer.Item
            label="Saving Goals"
            active={active === 'saving-goals'}
            onPress={() => setActive('saving-goals')}
          />
        </Drawer.Section>
        <Drawer.Section>
          <Drawer.Item
            label="Logout"
            active={active === 'logout'}
            onPress={() => dispatch(clear())}
          />
        </Drawer.Section>
      </SafeAreaView>
    );
  };

  return (
    <View style={{flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
      <DrawerLayout
        ref={drawer}
        drawerWidth={200}
        drawerPosition={DrawerLayout.positions.Left}
        drawerType="front"
        drawerBackgroundColor="#292929"
        renderNavigationView={renderDrawer}
        onDrawerSlide={handleDrawerSlide}>
        <Container>
          <Appbar>
            <Appbar.Action icon="menu" onPress={() => drawer.current.openDrawer()}/>
            <Appbar.Content title={title} subtitle={description}/>
            <Appbar.Action icon="account" onPress={() => setActive('account')}/>
            <Appbar.Action icon="help" onPress={() => setActive('help')}/>
          </Appbar>
        </Container>
        <CenteredContent>
          {active === 'dashboard' && <Dashboard/>}
          {active === 'transactions' && <Transactions/>}
          {active === 'categories' && <Categories/>}
          {active === 'tags' && <Tags/>}
          {active === 'importance-levels' && <ImportanceLevels/>}
          {active === 'templates' && <Templates/>}
          {active === 'recurring-transactions' && <RecurringTransactions/>}
          {active === 'guards' && <Guards/>}
          {active === 'saving-goals' && <SavingsGoals/>}
          {active === 'account' && <Account/>}
          {active === 'help' && <Help/>}
        </CenteredContent>
      </DrawerLayout>
    </View>
  )
}

export default DrawerWrapper
