import React, { Fragment } from "react";
import { Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";


export default observer(function ActivityList() {

    //โหลด activity store
    const { activityStore } = useStore();
    const { groupActivities } = activityStore;
    //const {deleteActivity, activityByDate, loading} = activityStore;

    // const [target, setTarget] = useState('');

    // function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
    //     setTarget(e.currentTarget.name);
    //     deleteActivity(id);
    // }

    return (

        <>
            {groupActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {activities.map(activity => (
                        <ActivityListItem key={activity.id} activity={activity} />
                    ))}
                </Fragment>

            ))}
        </>
    )
})
