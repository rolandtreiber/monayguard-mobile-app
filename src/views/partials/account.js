import React, {useContext, useEffect, useState} from "react";
import {Paragraph, Title, Avatar, Divider, Button, ActivityIndicator} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {FlexContainer, Row} from "../../components/shared-styled-components";
import {formatDateToDisplay} from "../../utils/utils";
import styled from "styled-components/native";
import {showModal} from "../../redux/actions/dialogActions";
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";
import {clear, setUserData} from "../../redux/actions/userActions";
import UpdateProfileDialog from "../../components/dialogs/update-profile-dialog";
import {APIContext} from "../../context/api-context";
import UpdatePasswordDialog from "../../components/dialogs/update-password-dialog";

export const MemberSince = styled(Paragraph)`
  font-size: 12px;
  color: #606060;
  margin: 0;
`

export const MemberId = styled(Paragraph)`
  font-size: 8px;
  margin: 0;
  color: #606060;
`

export const Key = styled(Paragraph)`
  font-size: 12px;
  margin: 0;
  color: #606060;
`

export const Value = styled(Paragraph)`
  margin-bottom: 15px;
`

const Account = () => {
  const userData = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const {getAccount} = useContext(APIContext)
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState({})

  const getInitials = () => {
    let initials = ''
    if (userData.first_name) initials += userData.first_name[0]
    if (userData.last_name) initials += userData.last_name[0]
    return initials
  }

  const commitDelete = () => {
    dispatch(clear())
  }

  const fetchAccountDetails = async () => {
    getAccount().then(response => {
      if (response && response.status === 200 && response.data) {
        dispatch(setUserData(response.data))
        setProfileData(response.data)
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const updated = () => {
    fetchAccountDetails().catch(e => console.log(e.message))
  }

  useEffect(() => {
    fetchAccountDetails().catch(e => console.log(e.message))
  }, [])

  useEffect(() => {
    userData && setProfileData({...userData})
  }, [userData])

  return (
    <>
      <FlexContainer>
        {isLoading ? (<ActivityIndicator/>) : (<FlexContainer>
          <Row>
            <Avatar.Text size={50} label={getInitials()}/>
          </Row>
          <Title>{userData.first_name} {userData.last_name}</Title>
          <MemberSince>Member since {formatDateToDisplay(new Date(userData.created_at))}</MemberSince>
          <MemberId>Member ID: {userData.id}</MemberId>
          <Divider style={{marginVertical: 5}}/>
          <Key>Email</Key>
          <Value>{userData.email}</Value>
          <Key>Currency</Key>
          <Value>{userData.currency_symbol}</Value>
          <Key>Currency Placement</Key>
          <Value>{userData.currency_placement ? "Before" : "After"}</Value>
          <Divider style={{marginBottom: 15}}/>
          <Row>
            <Button mode={"outlined"} style={{marginBottom: 5}} onPress={() => dispatch(showModal('manageAccount'))}>Update Profile</Button>
          </Row>
          <Row>
            <Button mode={"outlined"} style={{marginBottom: 15}} onPress={() => dispatch(showModal('updatePassword'))}>Update Password</Button>
          </Row>
          <Divider style={{marginBottom: 15}}/>
          <Row>
            <Button mode={"outlined"} style={{marginRight: 2}} labelStyle={{color: "red"}}
                    onPress={() => setDeleteDialogVisible(true)}
            >Delete Profile</Button>
          </Row>
          <ConfirmationDialog body={"You are about to delete your account. It is not reversible."} callback={commitDelete} visible={deleteDialogVisible} setVisible={setDeleteDialogVisible}/>
        </FlexContainer>)}
      </FlexContainer>
      <UpdateProfileDialog profileData={profileData} setProfileData={setProfileData} updated={updated}/>
      <UpdatePasswordDialog updated={updated}/>
    </>
  )
}

export default Account
