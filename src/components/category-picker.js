import React, {useContext, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import usePickable from "../hooks/use-pickable";
import {Row, RowWrap, Chip, Column, FlexContainer} from "./shared-styled-components";
import {Divider, IconButton, Button, Paragraph, TextInput} from "react-native-paper";
import {View} from "react-native";
import {APIContext} from "../context/api-context";

const CategoryPicker = ({type, selected, setSelected}) => {
  const categories = useSelector((state) => state.select.categories)
  const [search, setSearch] = useState('')
  const {createCategory} = useContext(APIContext)

  const {loadCategories} = usePickable()

  useEffect(() => {
    loadCategories(type, search)
  }, [type, search])

  const updated = () => {
    loadCategories(type, search)
  }

  const saveCategory = () => {
    createCategory({
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
        <Paragraph style={{alignSelf: "center"}}>Categories</Paragraph>
        <View style={{display: "flex", flex: 1}}/>
        {categories && categories.length === 0 && search !== '' && <Button
          labelStyle={{fontSize: 8}}
          style={{alignSelf: "center"}}
          onPress={() => saveCategory([])}
          size={16}
          icon="plus">Add: {search}</Button>}
        <IconButton style={{alignSelf: "center"}} onPress={() => setSelected([])} size={16} icon="delete"/>
        <Divider/>
      </Row>
      <Row>
        <FlexContainer>
          <TextInput onChangeText={(v) => setSearch(v)} value={search} label="Filter categories" mode="flat"/>
        </FlexContainer>
      </Row>
      <RowWrap style={{marginTop: 5}}>
        {selected && selected.map(c => <Chip key={c.value} style={{backgroundColor: "darkgreen"}} onPress={() => {
          const index = selected.indexOf(c)
          const cp = [...selected]
          cp.splice(index, 1)
          setSelected([...cp])
        }}>{c.text}</Chip>)}
        {categories && categories.map(c => selected.map(({value}) =>value).indexOf(c.value) === -1 && <Chip key={c.value}
                                                 onPress={() => setSelected([...selected, c])}>{c.text}</Chip>)}
      </RowWrap>
    </>
  )
}

export default CategoryPicker
