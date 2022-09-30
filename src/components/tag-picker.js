import React, {useContext, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import usePickable from "../hooks/use-pickable";
import {Row, RowWrap, Chip, Column, FlexContainer} from "./shared-styled-components";
import {Divider, IconButton, Button, Paragraph, TextInput} from "react-native-paper";
import {View} from "react-native";
import {APIContext} from "../context/api-context";

const TagPicker = ({type, selected, setSelected}) => {
  const tags = useSelector((state) => state.select.tags)
  const [search, setSearch] = useState('')
  const {createTag} = useContext(APIContext)

  const {loadTags} = usePickable()

  useEffect(() => {
    loadTags(type, search)
  }, [type, search])

  const updated = () => {
    loadTags(type, search)
  }

  const saveTag = () => {
    createTag({
      name: search, type
    }).then(response => {
      if (response && response.status === 200) {
        const {data} = response;
        if (data && response.status) {
          updated()
        }
      }
    })
  }

  return (
    <>
      <Row>
        <Paragraph style={{alignSelf: "center"}}>Tags</Paragraph>
        <View style={{display: "flex", flex: 1}}/>
        {tags && tags.length === 0 && search !== '' && <Button
          labelStyle={{fontSize: 8}}
          style={{alignSelf: "center"}}
          onPress={() => saveTag([])}
          size={16}
          icon="plus">Add: {search}</Button>}
        <IconButton style={{alignSelf: "center"}} onPress={() => setSelected([])} size={16} icon="delete"/>
        <Divider/>
      </Row>
      <Row>
        <FlexContainer>
          <TextInput onChangeText={(v) => setSearch(v)} value={search} label="Filter tags" mode="flat"/>
        </FlexContainer>
      </Row>
      <RowWrap style={{marginTop: 5}}>
        {selected && selected.map(c => <Chip key={c.value} style={{backgroundColor: "darkgreen"}} onPress={() => {
          const index = selected.indexOf(c)
          const cp = [...selected]
          cp.splice(index, 1)
          setSelected([...cp])
        }}>{c.text}</Chip>)}
        {tags && tags.map(c => selected.map(({value}) =>value).indexOf(c.value) === -1 && <Chip key={c.value}
                                                                                                onPress={() => setSelected([...selected, c])}>{c.text}</Chip>)}
      </RowWrap>
    </>
  )
}

export default TagPicker
