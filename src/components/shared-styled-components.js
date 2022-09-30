import styled from "styled-components/native";
import {Button as PaperButton, Text, FAB, IconButton, Paragraph, RadioButton as BaseRadioButton, Chip as BaseChip} from "react-native-paper";

export const Button = styled(PaperButton)`
  border-color: white;
`

export const Container = styled.SafeAreaView`
  background-color: #292929;
`

export const FlexContainer = styled.View`
  background-color: #292929;
  flex: 1;
  width: 100%;
`

export const CenteredContent = styled.View`
  flex: 1;
  background-color: #292929;
  align-items: center;
  justify-content: center;
  padding: 5%;
`

export const ScrollContent = styled.ScrollView`
  background-color: #292929;
  flex: 1;
  width: 100%;
`

export const Fab = styled(FAB)`
  position: absolute;
  margin: 36px;
  right: 0;
  bottom: 0;
`

export const Row = styled.View`
  display: flex;
  flex-direction: row;
`

export const Column = styled.View`
  display: flex;
  flex-direction: column;
`

export const RadioButton = styled(BaseRadioButton)`
  border: 1px solid white;
`

export const RadioLabel = styled(Paragraph)`
  align-self: center;
`

export const ButtonGroup = styled.View`
  flex-direction: row;
`

export const RoundButton = styled(IconButton)`
`

export const ModalContent = styled.ScrollView`
  background-color: #292929;
  padding: 5%;
  margin: 5%;
`

export const RowWrap = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const Chip = styled(BaseChip)`
  margin: 2px
`

export const SmallText = styled(Paragraph)`
  font-size: 12px;
  align-self: center;
`

export const SearchListItem = styled(Paragraph)`
  margin: 2px;
  font-size: 12px;
  border: 1px solid #777777;
  padding-left: 2px;
  padding-right: 2px;
  border-radius: 10px;
`

export const SubTitle = styled(Text)`
  font-size: 16px;
`
