import React, {Fragment, useContext, useEffect, useState} from "react";
import {ActivityIndicator} from "react-native-paper";
import {APIContext} from "../../context/api-context";
import {formatDateForApi, formatDateToDisplay, roundTo2Decimals} from "../../utils/utils";
import {BarChart, Grid, PieChart, StackedBarChart} from "react-native-svg-charts";
import {Card, Divider, Paragraph, Button, Title} from "react-native-paper";
import {Chip, Container, Row, RowWrap, ScrollContent, SmallText} from "../../components/shared-styled-components";
import {G, Text} from "react-native-svg";
import {useDispatch, useSelector} from "react-redux";
import TransactionDialog from "../../components/dialogs/transaction-dialog";
import TransactionTemplateDialog from "../../components/dialogs/transaction-template-dialog";
import {showModal} from "../../redux/actions/dialogActions";
import {Linking} from "react-native";
import GuardDialog from "../../components/dialogs/guard-dialog";
import SavingGoalDialog from "../../components/dialogs/saving-goal-dialog";
import usePrice from "../../hooks/use-price";

const Dashboard = () => {
  const userData = useSelector((state) => state.user.userData)
  const {getDashboard} = useContext(APIContext)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)))
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)))
  const [importanceBreakdown, setImportanceBreakdown] = useState([])
  const [quickStatsWeek, setQuickStatsWeek] = useState([])
  const [quickStatsMonth, setQuickStatsMonth] = useState([])
  const [guards, setGuards] = useState([])
  const [savingGoals, setSavingGoals] = useState([])
  const dispatch = useDispatch()
  const {price} = usePrice()

  const palette = [
    '#305cc7',
    '#30c2c7',
    '#7430c7',
    '#c730ae',
    '#30c79a',
    '#c7309c',
    '#3083c7',
    '#3038c7'
  ]

  const fetchData = async () => {
    setIsLoading(true)
    getDashboard({
      start_date: formatDateForApi(startDate),
      end_date: formatDateForApi(endDate),
    }).then(response => {
      if (response.status === 200 && response.data) {
        setData(response.data)
        setQuickStatsWeek([roundTo2Decimals(response.data.week_total_in), roundTo2Decimals(response.data.week_total_out), roundTo2Decimals(response.data.week_total_saving)])
        setQuickStatsMonth([roundTo2Decimals(response.data.month_total_in), roundTo2Decimals(response.data.month_total_out), roundTo2Decimals(response.data.month_total_saving)])
      }
    }).catch(e => {
      console.log(e.message)
    }).finally(() => setIsLoading(false))
  }

  const updated = () => {
    fetchData().catch(e => console.log(e.message))
  }

  useEffect(() => {
    fetchData().catch(e => console.log(e.message))
  }, [startDate, endDate])

  useEffect(() => {
    if (data && data.importance_breakdown_chart_data?.elements) {
      setImportanceBreakdown(data.importance_breakdown_chart_data.elements.map((e, index) => {
        return {
          name: e.name,
          label: (Math.round(e.percentage * 100) / 100)+"%",
          value: Math.round(e.value * 100) / 100,
          key: "pie-" + index,
          svg: {
            fill: palette[index]
          }
        }
      }))
    }
    if (data && data.guards) {
      setGuards(data.guards.map(g => {
        return {
          target: roundTo2Decimals(g.target),
          value: roundTo2Decimals(g.value),
          key: g.id,
          label: g.name,
          start: new Date(g.start),
          end: new Date(g.end)
        }
      }))
    }
    if (data && data.saving_goals) {
      setSavingGoals(data.saving_goals.map(g => {
        return {
          target: roundTo2Decimals(g.target),
          value: roundTo2Decimals(g.value),
          label: g.name,
          key: g.id,
          start: new Date(g.start),
          end: new Date(g.end)
        }
      }))
    }
  }, [data])

  const Labels = ({slices, height, width}) => {
    return slices.map((slice, index) => {
      const {labelCentroid, data} = slice;
      const labelAngle =
        Math.atan2(labelCentroid[1], labelCentroid[0]) + Math.PI / 2;
      return (
        <G key={index}>
          {data.value !== 0 && <Text
            transform={
              `translate(${labelCentroid[0]}, ${labelCentroid[1]})` +
              `rotate(${(360 * labelAngle) / (2 * Math.PI)})`
            }
            fill={'#fff'}
            textAnchor={'middle'}
            alignmentBaseline={'center'}
            fontSize={14}
            stroke={'black'}
            strokeWidth={0.3}
          >
            {data.label}
          </Text>}
        </G>
      );
    });
  }

  const dayPart = () => {
    const now = new Date()
    if (now.getHours() < 12) {
      return 'morning'
    }
    if (now.getHours() > 18) {
      return 'evening'
    }
    return 'afternoon'
  }

  const getStatsLabel = (index) => {
    switch (index) {
      case 0:
        return "Income: "
      case 1:
        return "Expense: "
      case 2:
        return "Saving: "
    }
  }

  const CUT_OFF = 20
  const BarChartLabels = ({  x, y, bandwidth, data }) => (
    quickStatsWeek.map((value, index) => (
      <Text
        key={ index }
        x={ value > CUT_OFF ? x(0) + 10 : x(value) + 10 }
        y={ y(index) + (bandwidth / 2) }
        fontSize={ 14 }
        fill={ value > CUT_OFF ? 'white' : 'black' }
        alignmentBaseline={ 'middle' }
      >
        {getStatsLabel(index)+""+price(value)}
      </Text>
    ))
  )

  const guardColors = ['#414b7b', '#5162a5', '#6d7dce', '#9ea9de']
  const savingGoalColors = ['#7b7341', '#a59751', '#cec16d', '#ded39e']

  const create = () => {
    dispatch(showModal('manageTransaction'))
  }

  const createFromTemplate = () => {
    dispatch(showModal('transactionFromTemplate'))
  }

  const showQuickStats = () => {
    if (quickStatsMonth && quickStatsMonth.length > 0 && (quickStatsMonth[0] !== 0 || quickStatsMonth[1] !== 0 || quickStatsMonth[2] !== 0)) {
      return true
    }
    return false
  }

  const showSpendingByImportanceChart = () => {
    let result = false;
    if (importanceBreakdown) {
      importanceBreakdown.some(i => {
        if (i.value !== 0) {
          result = true
        }
        if (result === true) {
          return true;
        }
      })
    }
    return result
  }

  return (
    <>
      {isLoading ? <Container><ActivityIndicator/></Container> : <ScrollContent>
        <Card elevation={5}>
          <Card.Title
            title={"Good "+dayPart()+" "+userData.first_name+"!"}
            subtitle={"See your quick stats"}
          />
          {showQuickStats() ? <Card.Content>
            <Paragraph>Last 7 days</Paragraph>
            {quickStatsWeek && <BarChart
              style={{ flex: 1, marginLeft: 8, height: 100 }}
              data={quickStatsWeek}
              horizontal={true}
              showGrid={false}
              svg={{ fill: 'rgba(71,65,244,0.8)' }}
              contentInset={{ top: 10, bottom: 10 }}
              spacing={0.2}
              gridMin={0}
            >
              <Grid direction={Grid.Direction.VERTICAL}/>
              <BarChartLabels/>
            </BarChart>}
            <Paragraph>Last 30 days</Paragraph>
            {quickStatsMonth && <BarChart
              style={{ flex: 1, marginLeft: 8, height: 100 }}
              data={quickStatsMonth}
              horizontal={true}
              svg={{ fill: 'rgba(65,223,244,0.8)' }}
              contentInset={{ top: 10, bottom: 10 }}
              spacing={0.2}
              gridMin={0}
            >
              <Grid direction={Grid.Direction.VERTICAL}/>
              <BarChartLabels/>
            </BarChart>}
          </Card.Content> : <Card.Content>
            <Title>Welcome!</Title>
            <Text>Finance tracking comes with many benefits explained really well int this
            <Text style={{color: '#9ea9de'}}
            onPress={() => Linking.openURL('https://www.kindafrugal.com/benefits-of-tracking-your-expenses/')}>
          {" "}article{" "}
            </Text>.</Text>
            <Paragraph>The purpose of MoneyGuard is enabling you to do it effortlessly while making the most out of it.</Paragraph>
            <Paragraph>You can tag and categorize all your transactions as well as assign importance level to them.</Paragraph>
            <Paragraph>To save time, you may create templates and automatically recurring transactions.</Paragraph>
            <Paragraph>To gain insights, you can use the advanced search as well as create Guards and Saving Goals.</Paragraph>
            <Paragraph>It is also possible to share your account with your household or family to do it together.</Paragraph>
            <Paragraph>Happy tracking!</Paragraph>
            </Card.Content>}
        </Card>
        <Divider style={{margin: 10}}/>
        <Card elevation={5}>
          <Card.Title
            title={"Add Transaction"}
            subtitle={"Create a new transaction"}
          />
          <Card.Content>
            <Row>
            <Button mode={"outlined"} onPress={create}>Blank</Button>
            <Button style={{marginLeft: 5}} mode={"outlined"} onPress={createFromTemplate}>From Template</Button>
            </Row>
          </Card.Content>
        </Card>
        <Divider style={{margin: 10}}/>
        {showSpendingByImportanceChart() && <Card elevation={5}>
          <Card.Title
            title={"Spending by Importance"}
            subtitle={"Your spending by priority in the last 30 days"}
          />
          <Card.Content>
            {importanceBreakdown && <>
              <PieChart style={{height: 200}}
                        data={importanceBreakdown}
                        labelRadius={'90%'}
                        outerRadius={'100%'}
              ><Labels/></PieChart>
            </>}
            <RowWrap style={{justifyContent: "center", paddingTop: 10}}>
            {importanceBreakdown.map((item, index) => <Chip key={item.id} style={{borderColor: palette[index]}}>{item.name+' - '+price(item.value)}</Chip>)}
            </RowWrap>
          </Card.Content>
        </Card>}
        <Divider style={{margin: 10}}/>
        <Card elevation={5}>
          <Card.Title
            title={"Guards"}
            subtitle={"See how well you are doing on your targets"}
          />
          <Card.Content>
            {guards.length > 0 ? guards.map(g => <Fragment key={g.id}>
                <Paragraph>{g.label}</Paragraph>
            <StackedBarChart
              style={{ height: 30 }}
              keys={['value', 'target']}
              colors={guardColors}
              data={[g]}
              showGrid={true}
              horizontal={true}
              contentInset={{ top: 0, bottom: 0 }}
            />
              <Row>
                <Row style={{alignSelf: 'flex-start'}}>
                  <SmallText>Target: {price(g.target)} </SmallText>
                  <SmallText>Value: {price(g.value)}</SmallText>
                </Row>
                <SmallText style={{flex: 1,fontSize: 9, alignSelf: 'flex-end', textAlign: "right"}}>{formatDateToDisplay(g.start)} - {formatDateToDisplay(g.end)}</SmallText>
              </Row>
            </Fragment>
            ) : <>
              <Paragraph>You don't have any guards set up yet.</Paragraph>
              <Button mode={"outlined"} onPress={() => dispatch(showModal('manageGuard'))}>Create a guard</Button>
              </>}
          </Card.Content>
        </Card>
        <Divider style={{margin: 10}}/>
        <Card elevation={5}>
          <Card.Title
            title={"Saving Goals"}
            subtitle={"See how well you are doing on your saving targets"}
          />
          <Card.Content>
            {savingGoals.length > 0 ? savingGoals.map(s => <Fragment key={s.id}>
                <Paragraph>{s.label}</Paragraph>
                <StackedBarChart
                  style={{ height: 30 }}
                  keys={['value', 'target']}
                  colors={savingGoalColors}
                  data={[s]}
                  showGrid={false}
                  horizontal={true}
                  contentInset={{ top: 0, bottom: 0 }}
                />
              <Row>
                <Row style={{alignSelf: 'flex-start'}}>
                  <SmallText style={{fontSize: 9}}>Target: {price(s.target)} </SmallText>
                  <SmallText style={{fontSize: 9}}>Value: {price(s.value)}</SmallText>
                </Row>
                <SmallText style={{flex: 1,fontSize: 9, alignSelf: 'flex-end', textAlign: "right"}}>{formatDateToDisplay(s.start)} - {formatDateToDisplay(s.end)}</SmallText>
              </Row>
              </Fragment>
            ) : <>
              <Paragraph>You don't have any saving goals set up yet.</Paragraph>
              <Button mode={"outlined"} onPress={() => dispatch(showModal('manageSavingGoal'))}>Create a saving goal</Button>
            </>}
          </Card.Content>
        </Card>
      </ScrollContent>}
      <TransactionDialog id={null} updated={updated}/>
      <GuardDialog id={null} updated={updated}/>
      <SavingGoalDialog id={null} updated={updated}/>
      <TransactionTemplateDialog updated={updated}/>
    </>
  )
}

export default Dashboard
