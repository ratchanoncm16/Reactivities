import { Form, Formik } from 'formik'
import { values } from 'mobx'
import React from 'react'
import MyTextInput from '../../app/common/form/MyTextInput'
import { Button } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store'

export default function LoginForm() {

    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(() => 
                setErrors({error: 'Invalid email or password'}))}
        >

            {({ handleSubmit, isSubmitting }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
}
