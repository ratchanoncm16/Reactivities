import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid"
import {format} from 'date-fns'
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activityByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            // Date.parse(a.date)- Date.parse(b.date));
        a.date!.getTime() - b.date!.getTime());
    }
    get groupActivities() {
        return Object.entries(
            this.activityByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy'); //const date = activity.date
                activities[date!] = activities[date!] ? [...activities[date!], activity] : [activity];
                return activities;
            }, {} as {[key:string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list(); // api get
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error)
            this.setLoadingInitial(false);

        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity) 
        {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(false);
            try {
                activity = await agent.Activities.detail(id);
                this.setActivity(activity);
                runInAction(() => {this.selectedActivity = activity;});
                
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false);
            }

        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        //console.log(user?.userName);
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.userName
            )
            //console.log("Check Host : " + activity.hostUsername + " === " + user.userName);
            activity.isHost = activity.hostUsername === user.userName;
            
            activity.host = activity.attendees?.find(u => u.username === activity.hostUsername);
        }

        activity.date = new Date(activity.date!); //activity.date!.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id:string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) =>{
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            runInAction(() => {
                console.log(error)
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) =>{
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() =>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            runInAction(() =>{
                console.log(error)
                this.loading = false;
            })
            
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                // if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
            
        }
    }

    //อัพเดทการเข้าร่วม attendee
    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = 
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.userName);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }

                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error);
            
        } finally {
            runInAction(() => this.loading = false);
        }
    }
    // deleteActivity = async (id: string) => {
    //     this.loading = true;
    //     try {
    //         await agent.Activities.delete(id);
    //         runInAction(() => {
    //             this.activityRegistry.delete(id);
    //             if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
    //             this.loading = false;
    //         })
    //     } catch (error) {
    //         runInAction(() => {
    //             console.log(error)
    //             this.loading = false;
    //         })
            
    //     }
    // }


}