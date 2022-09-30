import React, {useCallback, useContext, useEffect, useState} from "react";
import {Divider, List, TextInput, ActivityIndicator, Checkbox, Paragraph} from "react-native-paper";
import {
  ButtonGroup, Container,
  Fab,
  FlexContainer, RadioLabel,
  RoundButton,
  Row, SearchListItem, SmallText
} from "../../components/shared-styled-components";
import {FlatList} from "react-native";
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";
import {APIContext} from "../../context/api-context";
import {useDispatch, useSelector} from "react-redux";
import {showModal} from "../../redux/actions/dialogActions";
import TransactionAdvancedSearchDialog from "../../components/dialogs/transaction-advanced-search-dialog";
import TransactionDialog from "../../components/dialogs/transaction-dialog";
import TransactionViewModal from "../../components/modals/transaction-view-modal";
import {DatePickerModal} from "react-native-paper-dates";
import {
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
import AvatarIcon from "react-native-paper/src/components/Avatar/AvatarIcon";
import usePickable from "../../hooks/use-pickable";
import TransactionTemplateDialog from "../../components/dialogs/transaction-template-dialog";
import {formatDateForApi, formatDateToDisplay, roundTo2Decimals} from "../../utils/utils";
import usePrice from "../../hooks/use-price";
import styled from "styled-components/native";
registerTranslation('en', enGB)

export const Total = styled(Paragraph)`
  font-size: 12px;
  color: #606060;
  margin: 0;
  background-color: rgba(0,0,0,0.1);
  flex: 1;
  text-align: center;
`

const Transactions = () => {
  const {getTransactions, deleteTransaction} = useContext(APIContext)
  const importanceLevels = useSelector((state) => state.select.importanceLevels)
  const userData = useSelector((state) => state.user.userData)
  const [filter, setFilter] = useState({
    search: '',
    categories: [],
    tags: [],
    importance_levels: [],
    start_date: new Date(new Date().setMonth(new Date().getMonth()-1)),
    end_date: new Date(new Date().setDate(new Date().getDate()+1)),
    page: 0,
    order_by: 'date',
    order: 'DESC',
    types: [1, 2, 3]
  })
  const [page, setPage] = useState(0)
  const [dataState, setDataState] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const [id, setId] = useState()
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const {loadImportanceLevels} = usePickable()
  const {price} = usePrice()

  const fetchData = (clear = true, page = 0) => {
    if (clear || canLoadMore === true) {
      if (clear) {
        setCanLoadMore(true)
        setPage(0)
      }
      getTransactions({
        ...filter,
        importance_levels: filter.importance_levels.map(i => i.value),
        categories: filter.categories.map(c => c.value),
        tags: filter.tags.map(t => t.value),
        start_date: formatDateForApi(filter.start_date),
        end_date: formatDateForApi(filter.end_date)
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
        console.log(filter)
        console.log(e.response.data)
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }

  useEffect(() => {
    loadImportanceLevels()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    fetchData()
  }, [filter])

  const updated = () => {
    setId(null)
    fetchData()
  }

  const edit = (id) => {
    setId(id)
    dispatch(showModal('manageTransaction'))
  }

  const create = () => {
    setId(null)
    dispatch(showModal('manageTransaction'))
  }

  const createFromTemplate = () => {
    setId(null)
    dispatch(showModal('transactionFromTemplate'))
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
    deleteTransaction(id).then(() => {
      fetchData()
    })
  }

  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmDateRange = useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setFilter({
        ...filter,
        start_date: startDate,
        end_date: endDate
      })
    },
    [setOpen, setDate]
  );

  const toggleType = (type) => {
    const types = [...filter.types]
    if (filter.types.indexOf(type) !== -1) {
      types.splice(filter.types.indexOf(type), 1)
      setFilter({
        ...filter,
        types: types
      })
    } else {
      setFilter({
        ...filter,
        types: [...filter.types, type]
      })
    }
  }

  return (
    <>
      <Row>
        <FlexContainer>
          <TextInput
            onChangeText={(v) => setFilter({...filter, search: v})} value={filter.search} label="Search by name" mode="flat"
          />
        </FlexContainer>
        <RoundButton style={{alignSelf:"center"}} icon={"calendar"} onPress={() => setOpen(true)}/>
        <RoundButton style={{alignSelf:"center"}} icon={"text-box-search"} onPress={() => dispatch(showModal("transactionAdvancedSearch"))}/>
      </Row>
      <Row>
        <AvatarIcon style={{alignSelf: "center", marginRight: 5}} icon={"calendar"} size={14} /><SmallText>{formatDateToDisplay(filter.start_date)} - {formatDateToDisplay(filter.end_date)}</SmallText>
      </Row>
      {filter.types && <Row>
        <RadioLabel>Income</RadioLabel>
        <Checkbox
          status={filter.types.indexOf(1) !== -1 ? 'checked' : 'unchecked'}
          onPress={() => {
            toggleType(1)
          }}
        />
        <RadioLabel>Expense</RadioLabel>
        <Checkbox
          status={filter.types.indexOf(2) !== -1 ? 'checked' : 'unchecked'}
          onPress={() => {
            toggleType(2)
          }}
        />
        <RadioLabel>Saving</RadioLabel>
        <Checkbox
          status={filter.types.indexOf(3) !== -1 ? 'checked' : 'unchecked'}
          onPress={() => {
            toggleType(3)
          }}
        />
      </Row>}
      {filter.types.length === 1 && <Row>
        <Total>Total: {price(roundTo2Decimals(dataState.total))}</Total>
      </Row>}
      {(filter.categories.length > 0 || filter.tags.length > 0 || (importanceLevels && filter.types.length === 1 && filter.types[0] === 2) && filter.importance_levels) && <Row>
        {filter.categories.map(c => <SearchListItem style={{borderColor: "#92e790"}} onPress={() => {
          setIsLoading(true)
          const index = filter.categories.indexOf(c)
          const cp = [...filter.categories]
          cp.splice(index, 1)
          setFilter({
            ...filter,
            categories: [...cp]
          })
        }} key={c.value}>{c.text}</SearchListItem>)}
        {filter.tags.map(t => <SearchListItem style={{borderColor: "#90e0e7"}} onPress={() => {
          setIsLoading(true)
          const index = filter.tags.indexOf(t)
          const cp = [...filter.tags]
          cp.splice(index, 1)
          setFilter({
            ...filter,
            tags: [...cp]
          })
        }} key={t.value}>{t.text}</SearchListItem>)}
        {importanceLevels &&
          filter.types.length === 1 &&
          filter.types[0] === 2 &&
          filter.importance_levels && <>
            {filter.importance_levels.map(l => <SearchListItem key={importanceLevels.find(i => i.value === l.value)?.value} onPress={() => {
              setIsLoading(true)
              const index = filter.importance_levels.indexOf(l)
              const cp = [...filter.importance_levels]
              cp.splice(index, 1)
              setFilter({
              ...filter,
              importance_levels: [...cp]
            })}
            } style={{borderColor: "#a390e7"}}>{importanceLevels.find(i => i.value === l.value)?.text}</SearchListItem>)}
          </>}

      </Row>}
      <Divider/>
      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismissSingle}
        startDate={filter.start_date}
        endDate={filter.end_date}
        onConfirm={onConfirmDateRange}
      />
      <FlexContainer>
        {dataState && dataState.list?.length === 0 && <SmallText>There is no data to show</SmallText>}
        {isLoading ? <Container style={{marginTop: 15}}><ActivityIndicator/></Container> : <FlatList
          data={dataState.list}
          renderItem={(item) => (item.item && <List.Item
            description={formatDateToDisplay(new Date(item.item.created_at))}
            key={item.item.id}
            title={price(item.item.amount.toString())+" - "+item.item.name}
            left={props => {
              switch (parseInt(item.item.type)) {
                case 1:
                  // Income
                  return <RoundButton {...props} color={"#1aa12c"} style={{margin: 0}} size={20} icon="arrow-up-thin-circle-outline" onPress={() => view(item.item.id)}/>
                case 2:
                  // Expense
                  return <RoundButton {...props} color={"#A11A1AFF"} style={{margin: 0}} size={20} icon="arrow-down-thin-circle-outline" onPress={() => view(item.item.id)}/>
                case 3:
                  // Saving
                  return <RoundButton {...props} color={"#a19a1a"} style={{margin: 0}} size={20} icon="arrow-up-thin-circle-outline" onPress={() => view(item.item.id)}/>
              }
            }
            }
            right={props => (
              <ButtonGroup>
                <RoundButton {...props} style={{margin: 0}} size={20} icon="eye" onPress={() => view(item.item.id)}/>
                <RoundButton {...props} style={{margin: 0}} size={20} icon="pencil" onPress={() => edit(item.item.id)}/>
                <RoundButton {...props} style={{margin: 0}} size={20} color={"#a11a1a"} icon="delete" onPress={() => initDelete(item.item.id)}/>
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
        />}
      </FlexContainer>
      <Fab
        small
        icon="plus"
        onPress={create}
        onLongPress={createFromTemplate}
      />
      <TransactionDialog id={id} updated={updated}/>
      <TransactionTemplateDialog updated={updated}/>
      <TransactionViewModal id={id} visible={viewModalVisible} setVisible={setViewModalVisible}/>
      <ConfirmationDialog body={"You are about to delete a transaction"} callback={commitDelete} visible={deleteDialogVisible} setVisible={setDeleteDialogVisible}/>
      <TransactionAdvancedSearchDialog filter={filter} setFilter={setFilter} />
    </>
  )
}

export default Transactions
