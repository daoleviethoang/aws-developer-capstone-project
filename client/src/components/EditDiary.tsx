import * as React from 'react'
import { Form, Button, Card, Dropdown, Input, Image, TextArea, Divider } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getDiary, patchDiary } from '../api/diaries-api'
import { Diary } from '../types/Diary'
import dateFormat from 'dateformat'

interface EditDiaryProps {
    match: {
        params: {
            diaryId: string
        }
    }
    auth: Auth
}

interface EditDiaryState {
    diary: Diary
    newDiaryName: string
    newDiaryDescription: string
}

export class EditDiary extends React.PureComponent<EditDiaryProps, EditDiaryState> {

    state: EditDiaryState = {
        diary: {
            diaryId: '',
            createdAt: '',
            title: '',
            date: '',
            lock: false,
            password: '',
            description: ''
        },
        newDiaryName: '',
        newDiaryDescription: ''
    }

    async componentDidMount() {
        try {
            const diary = await getDiary(this.props.auth.getIdToken(), this.props.match.params.diaryId)
            this.setState({
                diary,
                newDiaryName: diary.title,
                newDiaryDescription: diary.description
            })
        } catch (e) {
            alert(`Failed to fetch diary: ${(e as Error).message}`)
        }
    }

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newDiaryName: event.target.value })
    }

    handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ newDiaryDescription: event.target.value })
    }

    onDiaryUpdate = async () => {
        try {
            const diary = this.state.diary;
            const diaryUpdated = await patchDiary(this.props.auth.getIdToken(), diary.diaryId, {
                title: this.state.newDiaryName,
                date: this.calculateDueDate(),
                description: this.state.newDiaryDescription
            })
            this.setState({
                newDiaryName: diaryUpdated.title,
                newDiaryDescription: diaryUpdated.description
            })
            alert('Diary update sucess')
        } catch {
            alert('Diary update failed')
        }
    }

    calculateDueDate(): string {
        const date = new Date()
        date.setDate(date.getDate() + 7)

        return dateFormat(date, 'yyyy-mm-dd') as string
    }

    render() {
        return (
            <div>
                <h1>Edit Diary</h1>
                <Divider></Divider>
                <div id='container-update'>
                    <Card fluid>
                        <div style={{ alignContent: "center", justifyContent: "center" }}>
                            <Form className='form-create'>
                                <Form.Field>
                                    <label >Title</label>
                                    <input placeholder='Title' onChange={this.handleNameChange} value={this.state.newDiaryName}></input>
                                </Form.Field>
                                <Form.Field>
                                    <label >Description</label>
                                    <TextArea placeholder='Description' onChange={this.handleDescriptionChange} value={this.state.newDiaryDescription} />
                                </Form.Field>
                                <Divider></Divider>
                                <Button type='submit' onClick={this.onDiaryUpdate} color='green' fluid>Submit</Button>
                            </Form>
                        </div>
                    </Card>

                    <div style={{ padding: '0px 0px 0px 10px', height: '50px'}}>
                        <Image src={this.state.diary.attachmentUrl} fluid rounded />
                    </div>
                </div>
                {/* <Form className='form-create'>
                        <Form.Field>
                            <label >Title</label>
                            <input placeholder='Title' onChange={this.handleNameChange} value={this.state.diary.title}></input>
                        </Form.Field>
                        <Form.Field>
                            <label >Description</label>
                            <TextArea placeholder='Description' onChange={this.handleDescriptionChange} value={this.state.diary.description} />
                        </Form.Field>
                        <Image src={this.state.diary.attachmentUrl} size='medium' centered />
                        <Divider></Divider>
                        <Button type='submit' onClick={this.onDiaryUpdate} color='green' fluid>Submit</Button>
                    </Form> */}
            </div>
        )
    }
}
