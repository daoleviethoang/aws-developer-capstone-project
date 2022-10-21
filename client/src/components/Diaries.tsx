import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Dropdown,
  Card,
  Form,
  TextArea
} from 'semantic-ui-react'

import { createDiary, deleteDiary, getDiaries, lockDiary, patchDiary, searchDiary, unlockDiary } from '../api/diaries-api'
import Auth from '../auth/Auth'
import { Diary } from '../types/Diary'
require('./Diaries.css')

const trigger = (
  <span>
    <Icon size='large' name='ellipsis horizontal'></Icon>
  </span>
)

interface DiariesProps {
  auth: Auth
  history: History
}

interface DiariesState {
  diaries: Diary[]
  newDiaryName: string
  loadingDiaries: boolean
  newDiaryDescription: string
  searchValue: string
  password: string
}

export class Diaries extends React.PureComponent<DiariesProps, DiariesState> {
  state: DiariesState = {
    diaries: [],
    newDiaryName: '',
    loadingDiaries: true,
    newDiaryDescription: '',
    searchValue: '',
    password: ''
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDiaryName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newDiaryDescription: event.target.value })
  }

  onUploadButtonClick = (diaryId: string) => {
    this.props.history.push(`/diary/${diaryId}/upload`)
  }

  onEditButtonClick = (diaryId: string) => {
    this.props.history.push(`/diary/${diaryId}/edit`)
  }

  onDiaryCreate = async () => {
    try {
      const date = this.calculateDueDate()
      const newDiary = await createDiary(this.props.auth.getIdToken(), {
        title: this.state.newDiaryName,
        description: this.state.newDiaryDescription,
        date
      })
      this.setState({
        newDiaryName: '',
        newDiaryDescription: '',
      })
      this.componentDidMount()
    } catch {
      alert('Diary creation failed')
    }
  }

  onDiaryDelete = async (diaryId: string) => {
    try {
      await deleteDiary(this.props.auth.getIdToken(), diaryId)
      this.setState({
        diaries: this.state.diaries.filter(diary => diary.diaryId !== diaryId)
      })
    } catch {
      alert('Diary deletion failed')
    }
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value })
  }

  handleSearch = async () => {
    try {
      const diariesSearch = await searchDiary(this.props.auth.getIdToken(), {searchValue: this.state.searchValue})
      this.setState({
        diaries: diariesSearch,
        searchValue: ''
      })
    } catch(err) {
      alert(err)
    }
  }

  handleLock = async (diaryId: string) => {
    var inputPasswordElement = (document.getElementById('inputPassword' + diaryId) as HTMLInputElement);
    var password = inputPasswordElement.value;
    console.log(password);
    console.log(diaryId)
    try {
      await lockDiary(this.props.auth.getIdToken(), diaryId, {password: password})
      inputPasswordElement.value = ''
      this.componentDidMount()
    } catch(err) {
      alert(err)
    }
  }

  handleUnlock = async (diaryId: string) => {
    var inputPasswordElement = (document.getElementById('inputPassword' + diaryId) as HTMLInputElement);
    var password = inputPasswordElement.value;
    console.log(password);
    console.log(diaryId)
    try {
      await unlockDiary(this.props.auth.getIdToken(), diaryId, {password: password})
      inputPasswordElement.value = ''
      this.componentDidMount()
    } catch(err) {
      alert(err)
    }
  }

  async componentDidMount() {
    try {
      const diaries = await getDiaries(this.props.auth.getIdToken())
      this.setState({
        diaries,
        loadingDiaries: false
      })
    } catch (e) {
      alert(`Failed to fetch diaries: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Diaries</Header>
        <Divider></Divider>
        <div id='container'>
          <div id='left'>
            {this.renderSearch()}
            {this.renderCreateDiaryInput()}
          </div>
          <div id='right'>
            {this.renderDiaries()}
          </div>
        </div>
      </div>
    )
  }

  renderSearch() {
    return (
      <div style={{ padding: "0px 0px 0px 0px" }}>
        <Input
          fluid
          icon={<Icon name='search' inverted circular link onClick={this.handleSearch}/>}
          placeholder='Search...'
          onChange={this.handleSearchChange}
        />
        <Divider></Divider>
      </div>
    )
  }

  renderCreateDiaryInput() {
    return (
      <div className='div-form-create'>
        <Form className='form-create'>
          <Form.Field>
            <label style={{ color: 'white' }}>Title</label>
            <input placeholder='Title' onChange={this.handleNameChange} value={this.state.newDiaryName}></input>
          </Form.Field>
          <Form.Field>
            <label style={{ color: 'white' }}>Description</label>
            <TextArea placeholder='Description' onChange={this.handleDescriptionChange} value={this.state.newDiaryDescription} />
          </Form.Field>
          <Button type='submit' onClick={this.onDiaryCreate}>Create</Button>
        </Form>
      </div>
    )
  }

  renderDiaries() {
    if (this.state.loadingDiaries) {
      return this.renderLoading()
    }

    return this.renderDiariesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Diaries
        </Loader>
      </Grid.Row>
    )
  }

  renderDiariesList() {
    return (
      <Card.Group itemsPerRow={1}>
        {this.state.diaries.map((diary, pos) => {
          return <Card>
            <Card.Content>
              <Card.Header>
                <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                  <div>
                    {diary.title}
                  </div>
                  <div>
                    <Dropdown
                      trigger={trigger}
                      icon={null}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item icon='upload' text='Upload' onClick={() => this.onUploadButtonClick(diary.diaryId)} />
                        <Dropdown.Item icon='pencil' text='Edit' onClick={() => this.onEditButtonClick(diary.diaryId)} />
                        <Dropdown.Item icon='delete' text='Delete' onClick={() => this.onDiaryDelete(diary.diaryId)} />
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </Card.Header>
              <Card.Meta>
                {diary.date}
              </Card.Meta>
              <Card.Description>
                {diary.description}
              </Card.Description>

            </Card.Content>
            <div style={{ textAlign: 'center' }}>
              <Image src={diary.attachmentUrl} fluid />
            </div>
            <Card.Content>
              <Input
                fluid
                icon='lock'
                iconPosition='left'
                id={'inputPassword' + diary.diaryId}
                action={diary.lock == false ?
                  {
                    color: 'red',
                    content: 'Lock This Diary',
                    onClick: () => this.handleLock(diary.diaryId)
                  } :
                  {
                    color: 'green',
                    content: 'Unlock This Diary',
                    onClick: () => this.handleUnlock(diary.diaryId)
                  }
                }
                type='Password'
                label={{ tag: true }}
                labelPosition='right'
                placeholder='Enter password'
              />
            </Card.Content>
          </Card>
        })}
      </Card.Group>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
