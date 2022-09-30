import React, {useContext, useEffect, useState} from "react";
import {
  Modal, Portal, Subheading, List, DataTable, ActivityIndicator
} from "react-native-paper";
import {APIContext} from "../../context/api-context";
import {Chip, ModalContent, RowWrap} from "../shared-styled-components";
import {formatDateTimeToDisplay} from "../../utils/utils";
import usePrice from "../../hooks/use-price";
import TypeChip from "../type-chip";


const TransactionViewModal = ({id, visible, setVisible}) => {
  const {getTransaction} = useContext(APIContext)
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const {price} = usePrice()

  const close = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      getTransaction(id).then(response => {
        if (response && response.status === 200) {
          const {data} = response;
          if (data && response.status) {
            setData(data)
          }
        }
      }).finally(() => {
        setIsLoading(false)
      })
    }
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
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>Type</DataTable.Cell>
                <DataTable.Cell><TypeChip type={data.type}/></DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Created At</DataTable.Cell>
                <DataTable.Cell>{formatDateTimeToDisplay(new Date(data.created_at))}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>Value</DataTable.Cell>
                <DataTable.Cell>{price(data.amount)}</DataTable.Cell>
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

export default TransactionViewModal
