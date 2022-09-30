import React, {useContext, useEffect, useState} from "react";
import {
  Paragraph, Modal, Portal, Subheading, DataTable, List, ActivityIndicator
} from "react-native-paper";
import {APIContext} from "../../context/api-context";
import {Chip, ModalContent, RowWrap} from "../shared-styled-components";

import {formatDateTimeToDisplay, formatDateToDisplay, getGuardInterval} from "../../utils/utils";
import TypeChip from "../type-chip";
import usePrice from "../../hooks/use-price";


const SavingGoalViewModal = ({id, visible, setVisible}) => {
  const {getSavingGoal} = useContext(APIContext)
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const {price} = usePrice()

  const close = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      getSavingGoal(id).then(response => {
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
            <Paragraph>Sub target basis: {getGuardInterval(data.frequency, data.frequency_basis)}</Paragraph>
            <Paragraph>{formatDateToDisplay(data.start)} - {formatDateToDisplay(data.end)}</Paragraph>
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
                <DataTable.Cell>Threshold</DataTable.Cell>
                <DataTable.Cell>{price(data.target)}</DataTable.Cell>
              </DataTable.Row>
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

export default SavingGoalViewModal
