import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import usePickable from "../hooks/use-pickable";
import {Row, RowWrap, Chip} from "./shared-styled-components";
import {Divider, Paragraph} from "react-native-paper";
import {View} from "react-native";

const ImportanceLevelPicker = ({selected, setSelected}) => {
  const importanceLevels = useSelector((state) => state.select.importanceLevels)
  const {loadImportanceLevels} = usePickable()

  useEffect(() => {
    loadImportanceLevels()
  }, [])

  const updated = () => {
    loadImportanceLevels()
  }

  return (
    <>
      <Row>
        <Paragraph style={{alignSelf: "center"}}>Importance Levels</Paragraph>
        <View style={{display: "flex", flex: 1}}/>
        <Divider/>
      </Row>
      <RowWrap style={{marginTop: 5}}>
        {selected && selected.map(c => <Chip key={c.value} style={{backgroundColor: "darkgreen"}} onPress={() => {
          const index = selected.indexOf(c)
          const cp = [...selected]
          cp.splice(index, 1)
          setSelected([...cp])
        }}>{c.text}</Chip>)}
        {importanceLevels && importanceLevels.map(c => selected.map(({value}) =>value).indexOf(c.value) === -1 && <Chip key={c.value}
                                                                                                            onPress={() => setSelected([...selected, c])}>{c.text}</Chip>)}
      </RowWrap>
    </>
  )
}

export default ImportanceLevelPicker
