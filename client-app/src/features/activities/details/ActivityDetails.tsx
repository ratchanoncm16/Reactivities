import React, { useEffect } from "react";
import {
    // CardMeta,
    // CardHeader,
    // CardDescription,
    // CardContent,
    // Card,
    // Image,
    // Button,
    Grid,
  } from 'semantic-ui-react'
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import {  useParams } from "react-router-dom";
import ActivityDetailHeader from "./ActivityDetailedHeader";
import ActivityDetailInfo from "./ActivityDetailedInfo";
import ActivityDetailChat from "./ActivityDetailedChat";
import ActivityDetailSidebar from "./ActivityDetailedSidebar";



export default observer( function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore;

    const {id} = useParams();

    useEffect(() => {
        if(id) loadActivity(id);
    },[id, loadActivity])

    if(loadingInitial || !activity) return <LoadingComponent />;

    return (
       <Grid>
        <Grid.Column width={10}>
            <ActivityDetailHeader activity={activity} />
            <ActivityDetailInfo activity={activity} />
            <ActivityDetailChat />
        </Grid.Column>
        <Grid.Column width={6}>
            <ActivityDetailSidebar attendees={activity.attendees!} />
        </Grid.Column>
       </Grid>
    )
})

{/* <Card fluid>
<Image src={`/assets/categoryImages/${activity.category}.jpg`} />
<CardContent>
    <CardHeader>{activity.title}</CardHeader>
    <CardMeta>
        <span className='date'>{activity.date}</span>
    </CardMeta>
    <CardDescription>
        {activity.description}
    </CardDescription>
</CardContent>
<CardContent extra>
    <Button.Group widths='2'>
        <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
        <Button as={Link} to={'/activities'} basic color='grey' content='Cancel' />
    </Button.Group>
</CardContent>
</Card> */}