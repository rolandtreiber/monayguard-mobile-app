import React, {useContext, useEffect, useState} from "react";
import {Divider, List, TextInput, Title} from "react-native-paper";
import {
  ButtonGroup, Fab,
  FlexContainer,
  RoundButton,
  Row, SmallText
} from "../../components/shared-styled-components";
import {FlatList} from "react-native";
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";
import {APIContext} from "../../context/api-context";
import {useDispatch} from "react-redux";
import {showModal} from "../../redux/actions/dialogActions";
import ImportanceLevelDialog from "../../components/dialogs/importance-level-dialog";
import ImportanceLevelViewModal from "../../components/modals/importance-level-view-modal";

const ImportanceLevels = () => {
  const {getImportanceLevels, deleteImportanceLevel} = useContext(APIContext)
  const [search, setSearch] = useState('')
  const [type, setType] = useState(2)
  const [page, setPage] = useState(0)
  const [dataState, setDataState] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const [id, setId] = useState()
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)

  const fetchData = (clear = true, page = 0) => {
    setIsLoading(true)
    if (clear || canLoadMore === true) {
      if (clear) {
        setCanLoadMore(true)
        setPage(0)
      }
      getImportanceLevels({
        search, page
      }).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data) {
            if (clear) {
              setDataState(data)
            } else {
              if (data.length > 0) {
                setDataState([...dataState, ...data])
              } else {
                setCanLoadMore(false)
              }
            }
          }
        }
      }).catch(e => {
        console.log(e.message)
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [type, search])

  const updated = () => {
    setId(null)
    fetchData()
  }

  const edit = (id) => {
    setId(id)
    dispatch(showModal('manageImportanceLevel'))
  }

  const create = () => {
    setId(null)
    dispatch(showModal('manageImportanceLevel'))
  }

  const view = (id) => {
    setId(id)
    setViewModalVisible(true)
  }

  const initDelete = (id) => {
    setId(id)
    setDeleteDialogVisible(true)
  }

  const commitDelete = () => {
    deleteImportanceLevel(id).then(() => {
      fetchData()
    })
  }

  return (
    <>
      <Row>
        <FlexContainer>
          <TextInput onChangeText={(v) => setSearch(v)} value={search} label="Search" mode="flat"/>
        </FlexContainer>
      </Row>
      <Divider/>
      <FlexContainer>
        {dataState && dataState.length === 0 && <SmallText>There is no data to show</SmallText>}
        <FlatList
          data={dataState}
          renderItem={(item) => (item.item && <List.Item
            key={item.item.id}
            title={item.item.level+" - "+item.item.name}
            right={props => (
              <ButtonGroup>
                <RoundButton {...props} size={20} icon="eye" onPress={() => view(item.item.id)}/>
                <RoundButton {...props} size={20} icon="pencil" onPress={() => edit(item.item.id)}/>
                <RoundButton {...props} size={20} color={"#a11a1a"} icon="delete" onPress={() => initDelete(item.item.id)}/>
              </ButtonGroup>
            )}
          />)}
          keyExtractor={(item) => item.id}
          onEndReached={(info) => {
            if (info.distanceFromEnd < 10 && canLoadMore) {
              setPage(page+1)
              fetchData(false, page + 1)
            }
          }}
        />

      </FlexContainer>
      <Fab
        small
        icon="plus"
        onPress={create}
      />
      <ImportanceLevelDialog id={id} updated={updated} type={type}/>
      <ImportanceLevelViewModal id={id} visible={viewModalVisible} setVisible={setViewModalVisible}/>
      <ConfirmationDialog body={"You are about to delete an importance level"} callback={commitDelete} visible={deleteDialogVisible} setVisible={setDeleteDialogVisible}/>
    </>
  )
}

export default ImportanceLevels
