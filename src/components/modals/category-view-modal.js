import React, {useContext, useEffect, useState} from "react";
import {
  Paragraph, Modal, Portal, Subheading, DataTable, List, Title, ActivityIndicator
} from "react-native-paper";
import {APIContext} from "../../context/api-context";
import {ModalContent} from "../shared-styled-components";
import {ScrollView} from "react-native";
import TypeChip from "../type-chip";
import {formatDateTimeToDisplay} from "../../utils/utils";
import usePrice from "../../hooks/use-price";


const CategoryViewModal = ({id, visible, setVisible}) => {
  const {getCategory} = useContext(APIContext)
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const {price} = usePrice()

  const close = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      getCategory(id).then(response => {
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
              <ScrollView style={{maxHeight:200}}>
                <Title>Recent Transactions</Title>
                {data.transactions && data.transactions.map(t => <List.Item key={t.id} title={t.name}
                                                                            description={formatDateTimeToDisplay(new Date(t.created_at))}
                                                                            right={(props) => <Paragraph {...props}>{price(t.amount)}</Paragraph>}
                />)}
                {(!data.transactions || data.transactions.length === 0) && <List.Item title={"No data to show"} description={"You don't have corresponding data"}/>}
                <Title>Recurring Transactions</Title>
                {data.recurring_transactions && data.recurring_transactions.map(t => <List.Item key={t.id} title={t.name}
                                                                            description={formatDateTimeToDisplay(new Date(t.created_at))}
                                                                            right={(props) => <Paragraph {...props}>{price(t.amount)}</Paragraph>}
                />)}
                {(!data.recurring_transactions || data.recurring_transactions.length === 0) && <List.Item title={"No data to show"} description={"You don't have corresponding data"}/>}
                <Title>Templates</Title>
                {data.templates && data.templates.map(t => <List.Item key={t.id} title={t.name}
                                                                                                description={formatDateTimeToDisplay(new Date(t.created_at))}
                                                                                                />)}
                {(!data.templates || data.templates.length === 0) && <List.Item title={"No data to show"} description={"You don't have corresponding data"}/>}
                <Title>Guards</Title>
                {data.guards && data.guards.map(t => <List.Item key={t.id} title={t.name}
                                                                      description={formatDateTimeToDisplay(new Date(t.created_at))}
                />)}
                {(!data.guards || data.guards.length === 0) && <List.Item title={"No data to show"} description={"You don't have corresponding data"}/>}
              </ScrollView>
            </DataTable>
          </ModalContent>
        )}
      </Modal>
    </Portal>
  )
}

export default CategoryViewModal
