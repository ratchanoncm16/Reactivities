import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom';
import { Image, List } from 'semantic-ui-react'
import { Profile } from '../../../app/models/profile';

interface Props {
    attendees: Profile[];
}
export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    return (
        <List horizontal>
            {attendees.map(attendees => (
                <List.Item key={attendees.username} as={Link} to={`/profile/${attendees.username}`} >
                    <Image size='mini' circular src={attendees.image || '/assets/user.png'} />
                </List.Item>
            ))}
        </List>
    )
})
