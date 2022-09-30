import React, {useContext, useEffect, useState} from "react";
import {
  Paragraph, Modal, Portal, Subheading, DataTable, List, ActivityIndicator
} from "react-native-paper";
import {APIContext} from "../../context/api-context";
import {Chip, ModalContent, RowWrap} from "../shared-styled-components";
import TypeChip from "../type-chip";
import {formatDateTimeToDisplay, getRecurringTransactionFrequency} from "../../utils/utils";


const RecurringTransactionViewModal = ({id, visible, setVisible}) => {
  const {getRecurringTransaction} = useContext(APIContext)
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const close = () => {
    setVisible(false)
  }

  const fetchData = async () => {
    if (id) {
      getRecurringTransaction(true)
      getRecurringTransaction(id).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            setData(data)
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
    fetchData().catch(e => {
      console.log(e.message)
    })
  }, [id])

  return (
    <Portal>
      <Modal visible={visible} onDismiss={close}>
        {isLoading ? (
          <ModalContent>
            <ActivityIndicator/>
          </ModalContent>
        ) : (
          <ModalContent>
            <Subheading>
              {data && data.name}
            </Subheading>
            <Paragraph>{getRecurringTransactionFrequency(data.frequency, data.frequency_basis)}</Paragraph>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Type</DataTable.Cell>
                <DataTable.Cell><TypeChip type={data.type}/></DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Created At</DataTable.Cell>
                <DataTable.Cell>{formatDateTimeToDisplay(new Date(data.created_at))}</DataTable.Cell>
              </DataTable.Row>
              {data.type === 2 && data.importance_level && <DataTable.Row>
                <DataTable.Cell>Importance level</DataTable.Cell>
                <DataTable.Cell>({data.importance_level.level}) {data.importance_level.name}</DataTable.Cell>
              </DataTable.Row>}
              <List.Item title={"Categories"}/>
              <RowWrap>{data.categories.map(c => <Chip key={c.id}>{c.name}</Chip>)}</RowWrap>
              <List.Item title={"Tags"}/>
              <RowWrap>{data.tags.map(t => <Chip key={t.id}>{t.name}</Chip>)}</RowWrap>
            </DataTable>
          </ModalContent>
        )}
      </Modal>
    </Portal>
  )
}

export default RecurringTransactionViewModal
