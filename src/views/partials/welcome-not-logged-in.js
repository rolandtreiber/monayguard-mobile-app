import React from "react";
import {Paragraph, Headline} from "react-native-paper";
import {showModal} from "../../redux/actions/dialogActions";
import styled from "styled-components/native";
import {Image} from "react-native";
import LogoImage from '../../assets/logo.png'
import {useDispatch} from "react-redux";
import {Button, CenteredContent} from "../../components/shared-styled-components";

const SubText = styled(Paragraph)`
  text-align: center;
  margin-top: 15px;
  line-height: 20px;
`

const BtnContainer = styled.View`
  flex-direction: row;
  margin-top: 20px;
`

const SignUpButton = styled(Button)`
  margin-right: 5px;
`

const Logo = styled(Image)`
  max-height: 200px;
  aspect-ratio: 1;
  width: 80%;
  resize-mode: contain;
`

const WelcomeNotLoggedIn = () => {
  const dispatch = useDispatch()

  return (
    <CenteredContent>
      <Logo source={LogoImage}/>
      <Headline>Welcome to MoneyGuard!</Headline>
      <SubText>the ultimate finance tracking
        tool to get your money
        habits in order.</SubText>
      <BtnContainer>
        <SignUpButton onPress={() => dispatch(showModal('signup'))} mode="outlined">Sign Up</SignUpButton>
        <Button onPress={() => dispatch(showModal('login'))} mode="outlined">Sign In</Button>
      </BtnContainer>
    </CenteredContent>)
}

export default WelcomeNotLoggedIn
