import React from "react";
import {Card, Divider, Paragraph, Title, Text} from "react-native-paper";
import {Column, FlexContainer, Row, ScrollContent, SubTitle} from "../../components/shared-styled-components";
import {Linking} from "react-native";

const Help = () => {
  return (
      <ScrollContent>
          <Card elevation={5}>
              <Card.Title
                  title={"The purpose"}
              />
              <Card.Content>
                  <Paragraph>The aim is to gain better understanding of your spending and saving habits. Thousands of articles and hundreds of books have been written about taking control of one's finances by adjusting the tendencies so a surplus can be generated and saved.</Paragraph>
                  <Paragraph>The process requires commitment and thus the recommended way is to track the transactions manually.</Paragraph>
                  <Paragraph>It does help and does work. It does not have to happen on paper or in a spreadsheet though. It can also be effortless and fun.</Paragraph>
                  <Paragraph>This application is there to help you with useful tools and features to make the most out of it.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Tracking"}
              />
              <Card.Content>
                  <Paragraph>Finance tracking simply means that you record each and every transaction. In MoneyGuard, you can also attach extra useful information to each transaction such as category, tag or importance level.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Categories"}
              />
              <Card.Content>
                  <Paragraph>While banks do record your ledger, they simply cannot categorize transactions as well as we humans do. By attaching category(ies) to a transaction, you may filter by them later.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Tags"}
              />
              <Card.Content>
                  <Paragraph>Tags are a further layer to differentiate and group transactions by a certain factor. A good example would be to find out how much is spent on fuel by each car within a household.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Importance"}
              />
              <Card.Content>
                  <Paragraph>To gain insights of where can money saved, it is useful to acknowledge how crucial each purchase were. You may filter by importance level.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Gaining insights"}
              />
              <Card.Content>
                  <Paragraph>Once you are comfortable with tracking your transactions, you can start thinking about optimization here and there. To gain clarity, you have powerful grouping and filtering options at your disposal. Simply use the advanced search functionality on the Transactions panel.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Guards"}
              />
              <Card.Content>
                  <Paragraph>Guards are automatic listeners to keep track of transactions that fall into a predefined set of criteria. For example if your daily budget of groceries is £350, you simply set a guard of monthly frequency with your budget as a threshold. From then on, the current status will show in your Dashboard</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Saving goals"}
              />
              <Card.Content>
                  <Paragraph>Hello</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Recurring transactions"}
              />
              <Card.Content>
                  <Paragraph>To make your life easier, we've implemented support for transactions automatically generated at a defined frequency along with Categories, Tags and importance level (when expense).</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Templates"}
              />
              <Card.Content>
                  <Paragraph>On the Transactions page you can long-press the "+" button in the bottom right corner to create a transaction by a template. Templates can have categories, tags and importance that are automatically assigned to the transaction.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"Data protection"}
              />
              <Card.Content>
                  <Paragraph>Your data is not shared with any third parties nor viewed by anyone. You may use an alias. MonayGuard is a tool for your benefit. It is also completely free.</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
          <Card elevation={5}>
              <Card.Title
                  title={"About"}
              />
              <Card.Content>
                  <Paragraph>MoneyGuard was developed by Roland Treiber <Text style={{color: '#9ea9de'}}
                                                                              onPress={() => Linking.openURL('https://thecaringdeveloper.com')}>
                      {" "}(The Caring Developer){" "}
                  </Text>in 2022.
                  </Paragraph>
                  <Paragraph>The entire codebase is available on Github under MIT license. You may self-host the api and build the mobile application.</Paragraph>
                  <Paragraph>If you like the app, please leave a 5* review. I appreciate your support!</Paragraph>
              </Card.Content>
          </Card>
          <Divider style={{margin: 10}}/>
      </ScrollContent>
  )
}

export default Help
