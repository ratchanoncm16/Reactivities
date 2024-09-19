import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/ResgisterForm";

export default observer(function HomePage() {

    const { userStore, modalStore } = useStore();
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to Reactivities' />
                        <Button as={Link} to='/activities' size='huge' inverted >
                            Go to Activiteis!
                        </Button>
                    </>

                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} as={Link} to='/login' size='huge' inverted >
                            Login!
                        </Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} as={Link} to='/register' size='huge' inverted >
                            Register!
                        </Button>
                    </>

                )}


            </Container>
        </Segment>
        // <Container style={{marginTop: '7em'}}>
        //     <h1>Home page</h1>
        //     <h3>Go to <Link to='/activities'>Activities</Link></h3>
        // </Container>
    )
})